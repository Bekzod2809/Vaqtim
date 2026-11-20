using System.Text.Json;
using System.Threading.Channels;
using WatchShop.Api.Configurations.Settings;
using WatchShop.Api.Exceptions;

namespace WatchShop.Api.Services;

public class TelegramBotHostedService : BackgroundService
{
    private const int WorkerCount = 4;
    private const int QueueCapacity = 500;

    private readonly TelegramSettings Settings;
    private readonly IHttpClientFactory HttpClientFactory;
    private readonly IServiceScopeFactory ScopeFactory;
    private readonly ILogger<TelegramBotHostedService> Logger;

    public TelegramBotHostedService(
        TelegramSettings settings,
        IHttpClientFactory httpClientFactory,
        IServiceScopeFactory scopeFactory,
        ILogger<TelegramBotHostedService> logger)
    {
        Settings = settings;
        HttpClientFactory = httpClientFactory;
        ScopeFactory = scopeFactory;
        Logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (string.IsNullOrWhiteSpace(Settings.BotToken))
        {
            Logger.LogWarning("Telegram bot ishlamaydi: Telegram__BotToken sozlanmagan.");
            return;
        }

        var client = HttpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(40);
        var baseUrl = $"https://api.telegram.org/bot{Settings.BotToken}";
        long offset = 0;
        var queues = Enumerable.Range(0, WorkerCount)
            .Select(_ => Channel.CreateBounded<JsonElement>(new BoundedChannelOptions(QueueCapacity)
            {
                FullMode = BoundedChannelFullMode.Wait,
                SingleWriter = true,
                SingleReader = true
            }))
            .ToArray();
        var workers = queues
            .Select(queue => ProcessQueueAsync(queue.Reader, client, baseUrl, stoppingToken))
            .ToArray();

        try
        {
            try
            {
                using var response = await client.PostAsJsonAsync(
                    $"{baseUrl}/deleteWebhook",
                    new { drop_pending_updates = false },
                    stoppingToken);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                LogTelegramFailure(ex, "pollingni tayyorlash");
            }

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var response = await client.GetAsync(
                        $"{baseUrl}/getUpdates?timeout=25&offset={offset}&allowed_updates=%5B%22message%22%5D",
                        stoppingToken);
                    response.EnsureSuccessStatusCode();

                    using var payload = JsonDocument.Parse(await response.Content.ReadAsStringAsync(stoppingToken));
                    if (!payload.RootElement.GetProperty("ok").GetBoolean())
                    {
                        throw new InvalidOperationException("Telegram getUpdates so'rovi muvaffaqiyatsiz tugadi.");
                    }

                    foreach (var update in payload.RootElement.GetProperty("result").EnumerateArray())
                    {
                        offset = update.GetProperty("update_id").GetInt64() + 1;
                        if (!update.TryGetProperty("message", out var message) ||
                            !message.TryGetProperty("chat", out var chat) ||
                            !chat.TryGetProperty("id", out var chatIdValue))
                        {
                            continue;
                        }

                        var chatId = chatIdValue.GetInt64();
                        var queueIndex = (int)((ulong)chatId % WorkerCount);
                        await queues[queueIndex].Writer.WriteAsync(message.Clone(), stoppingToken);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    LogTelegramFailure(ex, "yangilanishni olish");
                    await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                }
            }
        }
        finally
        {
            foreach (var queue in queues)
            {
                queue.Writer.TryComplete();
            }

            await Task.WhenAll(workers);
        }
    }

    private async Task ProcessQueueAsync(
        ChannelReader<JsonElement> reader,
        HttpClient client,
        string baseUrl,
        CancellationToken cancellationToken)
    {
        await foreach (var message in reader.ReadAllAsync(cancellationToken))
        {
            try
            {
                await HandleMessageAsync(client, baseUrl, message, cancellationToken);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                LogTelegramFailure(ex, "xabarni qayta ishlash");
            }
        }
    }

    private void LogTelegramFailure(Exception exception, string operation)
    {
        var statusCode = (exception as HttpRequestException)?.StatusCode;
        Logger.LogWarning(
            "Telegram bot {Operation} jarayonida xatolik. HTTP status: {StatusCode}; sabab turi: {ExceptionType}.",
            operation,
            statusCode,
            exception.GetType().Name);
    }

    private async Task HandleMessageAsync(
        HttpClient client,
        string baseUrl,
        JsonElement message,
        CancellationToken cancellationToken)
    {
        if (!message.TryGetProperty("chat", out var chat) ||
            !message.TryGetProperty("from", out var sender) ||
            !chat.TryGetProperty("id", out var chatIdValue) ||
            !sender.TryGetProperty("id", out var senderIdValue))
        {
            return;
        }

        var chatId = chatIdValue.GetInt64();
        var senderId = senderIdValue.GetInt64();
        var isPrivateChat = chat.TryGetProperty("type", out var chatType) && chatType.GetString() == "private";

        if (!isPrivateChat)
        {
            await SendMessageAsync(client, baseUrl, chatId,
                "Raqamni tasdiqlash uchun bot bilan shaxsiy chatni oching.", cancellationToken);
            return;
        }

        if (message.TryGetProperty("text", out var textValue) &&
            textValue.GetString()?.StartsWith("/start", StringComparison.OrdinalIgnoreCase) == true)
        {
            await SendContactRequestAsync(client, baseUrl, chatId, cancellationToken);
            return;
        }

        if (!message.TryGetProperty("contact", out var contact))
        {
            return;
        }

        if (!contact.TryGetProperty("user_id", out var contactUserId) ||
            contactUserId.GetInt64() != senderId)
        {
            await SendMessageAsync(client, baseUrl, chatId,
                "Iltimos, o'zingizning telefon raqamingizni botdagi tugma orqali ulashing.", cancellationToken);
            return;
        }

        var phone = contact.TryGetProperty("phone_number", out var phoneValue)
            ? phoneValue.GetString() ?? string.Empty
            : string.Empty;

        try
        {
            using var scope = ScopeFactory.CreateScope();
            var verificationService = scope.ServiceProvider.GetRequiredService<IPhoneVerificationService>();
            var code = await verificationService.CreateCodeAsync(senderId, phone);

            if (code == null)
            {
                await SendMessageAsync(client, baseUrl, chatId,
                    "Kod yaqinda yuborilgan. 1 daqiqadan keyin qayta urinib ko'ring.", cancellationToken);
                return;
            }

            await SendMessageAsync(client, baseUrl, chatId,
                $"Tasdiqlash kodingiz: {code}\nKod 5 daqiqa amal qiladi. Uni saytga kiriting.", cancellationToken,
                removeKeyboard: true);
        }
        catch (BadRequestException ex)
        {
            await SendMessageAsync(client, baseUrl, chatId, ex.Message, cancellationToken);
        }
    }

    private static Task SendContactRequestAsync(
        HttpClient client,
        string baseUrl,
        long chatId,
        CancellationToken cancellationToken)
    {
        return SendMessageAsync(client, baseUrl, chatId,
            "Telefon raqamingizni tasdiqlash uchun quyidagi tugmani bosing.", cancellationToken,
            requestContact: true);
    }

    private static async Task SendMessageAsync(
        HttpClient client,
        string baseUrl,
        long chatId,
        string text,
        CancellationToken cancellationToken,
        bool requestContact = false,
        bool removeKeyboard = false)
    {
        object? replyMarkup = requestContact
            ? new
            {
                keyboard = new[] { new[] { new { text = "📱 Raqamimni ulashish", request_contact = true } } },
                resize_keyboard = true,
                one_time_keyboard = true
            }
            : removeKeyboard ? new { remove_keyboard = true } : null;

        using var response = await client.PostAsJsonAsync(
            $"{baseUrl}/sendMessage",
            new { chat_id = chatId, text, reply_markup = replyMarkup },
            cancellationToken);
        response.EnsureSuccessStatusCode();
    }
}
