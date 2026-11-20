using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Dtos;
using WatchShop.Api.Configurations.Settings;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService AuthService;
    private readonly TelegramSettings TelegramSettings;

    public AuthController(IAuthService authService, TelegramSettings telegramSettings)
    {
        AuthService = authService;
        TelegramSettings = telegramSettings;
    }

    [HttpGet("telegram-bot")]
    public ActionResult<string?> GetTelegramBotLink()
    {
        var username = TelegramSettings.BotUsername.Trim().TrimStart('@');
        return Ok(string.IsNullOrWhiteSpace(username) ? null : $"https://t.me/{username}");
    }

    [HttpPost("register")]
    public async Task<long> Register(RegisterDto dto)
    {
        return await AuthService.RegisterAsync(dto);
    }

    [HttpPost("login")]
    public async Task<LoginResponseDto> Login(LoginDto dto)
    {
        return await AuthService.LoginAsync(dto);
    }
}
