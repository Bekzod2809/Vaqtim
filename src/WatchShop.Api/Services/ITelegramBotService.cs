using System.Text.Json;

namespace WatchShop.Api.Services;

public interface ITelegramBotService
{
    bool IsConfigured { get; }
    string BaseApiUrl { get; }
    string? WebhookEndpointUrl { get; }
    bool IsValidWebhookSecret(string? providedSecret);
    Task<bool> ValidateTokenAsync(CancellationToken cancellationToken);
    Task RegisterWebhookAsync(CancellationToken cancellationToken);
    Task DeleteWebhookAsync(CancellationToken cancellationToken);
    Task HandleMessageAsync(JsonElement message, CancellationToken cancellationToken);
    void LogTelegramFailure(Exception exception, string operation);
}
