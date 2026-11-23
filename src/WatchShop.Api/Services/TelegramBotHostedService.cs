using System.Text.Json;
using System.Threading.Channels;

namespace WatchShop.Api.Services;

public class TelegramBotHostedService : BackgroundService
{
    private const int WorkerCount = 4;
    private const int QueueCapacity = 500;

    private readonly ITelegramBotService BotService;
    private readonly IHttpClientFactory HttpClientFactory;
    private readonly ILogger<TelegramBotHostedService> Logger;

    public TelegramBotHostedService(
        ITelegramBotService botService,
        IHttpClientFactory httpClientFactory,
        ILogger<TelegramBotHostedService> logger)
    {
        BotService = botService;
        HttpClientFactory = httpClientFactory;
        Logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!BotService.IsConfigured)
        {
            Logger.LogWarning("Telegram bot ishlamaydi: Telegram__BotToken sozlanmagan.");
            return;
        }

        if (!await BotService.ValidateTokenAsync(stoppingToken))
        {
            return;
        }

        if (!string.IsNullOrWhiteSpace(BotService.WebhookEndpointUrl))
        {
            await BotService.RegisterWebhookAsync(stoppingToken);
            return;
        }

        await RunPollingAsync(stoppingToken);
    }

    private async Task RunPollingAsync(CancellationToken stoppingToken)
    {
        var client = HttpClientFactory.CreateClient("Telegram");
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
            .Select(queue => ProcessQueueAsync(queue.Reader, stoppingToken))
            .ToArray();

        try
        {
            try
            {
                await BotService.DeleteWebhookAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                BotService.LogTelegramFailure(ex, "pollingni tayyorlash");
            }

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var response = await client.GetAsync(
                        $"{BotService.BaseApiUrl}/getUpdates?timeout=25&offset={offset}&allowed_updates=%5B%22message%22%5D",
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
                    BotService.LogTelegramFailure(ex, "yangilanishni olish");
                    try
                    {
                        await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                    }
                    catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                    {
                        break;
                    }
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
        CancellationToken cancellationToken)
    {
        try
        {
            await foreach (var message in reader.ReadAllAsync(cancellationToken))
            {
                try
                {
                    await BotService.HandleMessageAsync(message, cancellationToken);
                }
                catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    BotService.LogTelegramFailure(ex, "xabarni qayta ishlash");
                }
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
    }
}
