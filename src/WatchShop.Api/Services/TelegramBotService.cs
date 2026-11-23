using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using WatchShop.Api.Configurations.Settings;
using WatchShop.Api.Exceptions;

namespace WatchShop.Api.Services;

public class TelegramBotService : ITelegramBotService
{
    private const string WebhookPath = "/api/telegram/webhook";

    private readonly string NormalizedToken;
    private readonly string WebhookSecret;
    private readonly IHttpClientFactory HttpClientFactory;
    private readonly IServiceScopeFactory ScopeFactory;
    private readonly ILogger<TelegramBotService> Logger;

    public bool IsConfigured => !string.IsNullOrWhiteSpace(NormalizedToken);
    public string BaseApiUrl => IsConfigured ? $"https://api.telegram.org/bot{NormalizedToken}" : string.Empty;
    public string? WebhookEndpointUrl { get; }

    public TelegramBotService(
        TelegramSettings settings,
        IHttpClientFactory httpClientFactory,
        IServiceScopeFactory scopeFactory,
        ILogger<TelegramBotService> logger)
    {
        HttpClientFactory = httpClientFactory;
        ScopeFactory = scopeFactory;
        Logger = logger;

        NormalizedToken = NormalizeToken(settings.BotToken);
        WebhookEndpointUrl = ResolveWebhookEndpointUrl(settings.WebhookUrl);
        WebhookSecret = ResolveWebhookSecret(settings.WebhookSecret, NormalizedToken);
    }

    public bool IsValidWebhookSecret(string? providedSecret)
    {
        if (!IsConfigured ||
            string.IsNullOrEmpty(WebhookSecret) ||
            string.IsNullOrEmpty(providedSecret))
        {
            return false;
        }

        var expectedBytes = Encoding.UTF8.GetBytes(WebhookSecret);
        var actualBytes = Encoding.UTF8.GetBytes(providedSecret);
        return expectedBytes.Length == actualBytes.Length &&
               CryptographicOperations.FixedTimeEquals(expectedBytes, actualBytes);
    }

    public async Task<bool> ValidateTokenAsync(CancellationToken cancellationToken)
    {
        if (!IsConfigured)
        {
            return false;
        }

        var client = HttpClientFactory.CreateClient("Telegram");
        try
        {
            using var meResponse = await client.GetAsync($"{BaseApiUrl}/getMe", cancellationToken);
            if (!meResponse.IsSuccessStatusCode)
            {
                if (meResponse.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
                {
                    Logger.LogError(
                        "Telegram bot tokeni noto'g'ri (getMe HTTP {StatusCode}). Render'dagi Telegram__BotToken qiymatini tekshiring.",
                        (int)meResponse.StatusCode);
                    return false;
                }

                var description = await TryReadDescriptionAsync(meResponse, cancellationToken);
                Logger.LogWarning(
                    "Telegram getMe tekshiruvi kutilmagan javob qaytardi (HTTP {StatusCode}): {Description}",
                    (int)meResponse.StatusCode,
                    description ?? "tafsilot yo'q");
                return true;
            }

            using var me = JsonDocument.Parse(await meResponse.Content.ReadAsStringAsync(cancellationToken));
            var username = me.RootElement.TryGetProperty("result", out var result) &&
                           result.TryGetProperty("username", out var usernameProp)
                ? usernameProp.GetString()
                : null;
            Logger.LogInformation("Telegram bot ishga tushdi: @{Username}", username ?? "noma'lum");
            return true;
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            LogTelegramFailure(ex, "getMe tekshiruvi");
            return true;
        }
    }

    public async Task RegisterWebhookAsync(CancellationToken cancellationToken)
    {
        if (!IsConfigured || string.IsNullOrWhiteSpace(WebhookEndpointUrl))
        {
            return;
        }

        TimeSpan[] retryDelays =
        [
            TimeSpan.FromSeconds(2),
            TimeSpan.FromSeconds(4),
            TimeSpan.FromSeconds(8),
            TimeSpan.FromSeconds(16)
        ];

        var client = HttpClientFactory.CreateClient("Telegram");
        var payload = new
        {
            url = WebhookEndpointUrl,
            secret_token = WebhookSecret,
            allowed_updates = new[] { "message" },
            drop_pending_updates = false
        };

        for (var attempt = 0; attempt <= retryDelays.Length; attempt++)
        {
            try
            {
                using var response = await client.PostAsJsonAsync(
                    $"{BaseApiUrl}/setWebhook",
                    payload,
                    cancellationToken);

                if (response.IsSuccessStatusCode)
                {
                    Logger.LogInformation("Telegram webhook o'rnatildi: {WebhookUrl}", WebhookEndpointUrl);
                    return;
                }

                var description = await TryReadDescriptionAsync(response, cancellationToken);
                Logger.LogWarning(
                    "Telegram setWebhook xatosi (HTTP {StatusCode}): {Description}",
                    (int)response.StatusCode,
                    description ?? "tafsilot yo'q");
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                LogTelegramFailure(ex, "webhookni o'rnatish");
            }

            if (attempt < retryDelays.Length)
            {
                await Task.Delay(retryDelays[attempt], cancellationToken);
            }
        }

        Logger.LogError(
            "Telegram webhookni {Attempts} urinishdan keyin ham o'rnatib bo'lmadi: {WebhookUrl}",
            retryDelays.Length + 1,
            WebhookEndpointUrl);
    }

    public async Task DeleteWebhookAsync(CancellationToken cancellationToken)
    {
        if (!IsConfigured)
        {
            return;
        }

        var client = HttpClientFactory.CreateClient("Telegram");
        using var response = await client.PostAsJsonAsync(
            $"{BaseApiUrl}/deleteWebhook",
            new { drop_pending_updates = false },
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var description = await TryReadDescriptionAsync(response, cancellationToken);
            Logger.LogWarning(
                "Telegram deleteWebhook xatosi (HTTP {StatusCode}): {Description}",
                (int)response.StatusCode,
                description ?? "tafsilot yo'q");
            response.EnsureSuccessStatusCode();
        }
    }

    public async Task HandleMessageAsync(JsonElement message, CancellationToken cancellationToken)
    {
        if (!IsConfigured)
        {
            return;
        }

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
            await SendMessageAsync(chatId,
                "Raqamni tasdiqlash uchun bot bilan shaxsiy chatni oching.", cancellationToken);
            return;
        }

        if (!message.TryGetProperty("contact", out var contact))
        {
            await SendContactRequestAsync(chatId, cancellationToken);
            return;
        }

        if (!contact.TryGetProperty("user_id", out var contactUserId) ||
            contactUserId.GetInt64() != senderId)
        {
            await SendMessageAsync(chatId,
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
                await SendMessageAsync(chatId,
                    "Kod yaqinda yuborilgan. 1 daqiqadan keyin qayta urinib ko'ring.", cancellationToken);
                return;
            }

            await SendMessageAsync(chatId,
                $"Tasdiqlash kodingiz: {code}\nKod 5 daqiqa amal qiladi. Uni saytga kiriting.", cancellationToken,
                removeKeyboard: true);
        }
        catch (BadRequestException ex)
        {
            await SendMessageAsync(chatId, ex.Message, cancellationToken);
        }
    }

    public void LogTelegramFailure(Exception exception, string operation)
    {
        var statusCode = (exception as HttpRequestException)?.StatusCode;
        if (statusCode == HttpStatusCode.Conflict)
        {
            Logger.LogWarning(
                "Telegram bot {Operation}: 409 Conflict - shu token bilan boshqa joyda (masalan, kompyuteringizda) ham bot ishlab turibdi. Uni to'xtating.",
                operation);
            return;
        }

        Logger.LogWarning(
            "Telegram bot {Operation} jarayonida xatolik. HTTP status: {StatusCode}; sabab turi: {ExceptionType}.",
            operation,
            statusCode,
            exception.GetType().Name);
    }

    private Task SendContactRequestAsync(long chatId, CancellationToken cancellationToken)
    {
        return SendMessageAsync(chatId,
            "Telefon raqamingizni tasdiqlash uchun quyidagi tugmani bosing.", cancellationToken,
            requestContact: true);
    }

    private async Task SendMessageAsync(
        long chatId,
        string text,
        CancellationToken cancellationToken,
        bool requestContact = false,
        bool removeKeyboard = false)
    {
        var payload = new Dictionary<string, object>
        {
            ["chat_id"] = chatId,
            ["text"] = text
        };

        if (requestContact)
        {
            payload["reply_markup"] = new
            {
                keyboard = new[] { new[] { new { text = "📱 Raqamimni ulashish", request_contact = true } } },
                resize_keyboard = true,
                one_time_keyboard = true
            };
        }
        else if (removeKeyboard)
        {
            payload["reply_markup"] = new { remove_keyboard = true };
        }

        var client = HttpClientFactory.CreateClient("Telegram");
        using var response = await client.PostAsJsonAsync(
            $"{BaseApiUrl}/sendMessage",
            payload,
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var description = await TryReadDescriptionAsync(response, cancellationToken);
            Logger.LogWarning(
                "Telegram sendMessage xatosi (HTTP {StatusCode}): {Description}",
                (int)response.StatusCode,
                description ?? "tafsilot yo'q");
            response.EnsureSuccessStatusCode();
        }
    }

    private static string NormalizeToken(string? rawToken)
    {
        var token = (rawToken ?? string.Empty).Trim().Trim('"', '\'').Trim();
        if (token.StartsWith("bot", StringComparison.OrdinalIgnoreCase) &&
            token.Length > 3 &&
            char.IsAsciiDigit(token[3]))
        {
            token = token[3..];
        }

        return token;
    }

    private static string? ResolveWebhookEndpointUrl(string? configuredWebhookUrl)
    {
        var rawUrl = !string.IsNullOrWhiteSpace(configuredWebhookUrl)
            ? configuredWebhookUrl.Trim()
            : Environment.GetEnvironmentVariable("RENDER_EXTERNAL_URL")?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(rawUrl) ||
            !rawUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        rawUrl = rawUrl.TrimEnd('/');
        if (rawUrl.EndsWith(WebhookPath, StringComparison.OrdinalIgnoreCase))
        {
            return rawUrl;
        }

        return $"{rawUrl}{WebhookPath}";
    }

    private static string ResolveWebhookSecret(string? configuredSecret, string normalizedToken)
    {
        var secret = (configuredSecret ?? string.Empty).Trim();
        if (!string.IsNullOrEmpty(secret))
        {
            return secret;
        }

        if (string.IsNullOrWhiteSpace(normalizedToken))
        {
            return string.Empty;
        }

        var hash = SHA256.HashData(Encoding.UTF8.GetBytes($"{normalizedToken}:telegram-webhook"));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    private static async Task<string?> TryReadDescriptionAsync(HttpResponseMessage response, CancellationToken cancellationToken)
    {
        try
        {
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(content))
            {
                return null;
            }

            using var doc = JsonDocument.Parse(content);
            return doc.RootElement.TryGetProperty("description", out var description)
                ? description.GetString()
                : null;
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch
        {
            return null;
        }
    }
}
