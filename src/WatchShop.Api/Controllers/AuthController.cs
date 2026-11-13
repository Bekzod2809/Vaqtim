using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Dtos;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService AuthService;

    public AuthController(IAuthService authService)
    {
        AuthService = authService;
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
