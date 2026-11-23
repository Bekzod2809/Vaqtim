using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/telegram")]
[ApiController]
[AllowAnonymous]
public class TelegramWebhookController : ControllerBase
{
    private readonly ITelegramBotService BotService;

    public TelegramWebhookController(ITelegramBotService botService)
    {
        BotService = botService;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> ReceiveUpdate(
        [FromBody] JsonElement update,
        CancellationToken cancellationToken)
    {
        if (!BotService.IsConfigured)
        {
            return NotFound();
        }

        var secret = Request.Headers["X-Telegram-Bot-Api-Secret-Token"].ToString();
        if (!BotService.IsValidWebhookSecret(secret))
        {
            return Unauthorized();
        }

        if (update.ValueKind == JsonValueKind.Object &&
            update.TryGetProperty("message", out var message))
        {
            try
            {
                await BotService.HandleMessageAsync(message, cancellationToken);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                BotService.LogTelegramFailure(ex, "webhook xabarini qayta ishlash");
            }
        }

        return Ok();
    }
}
