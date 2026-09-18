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

    [HttpPost("royxatdan-otish")]
    public async Task<long> RoyxatdanOtish(RoyxatdanOtishDto dto)
    {
        return await AuthService.RegisterAsync(dto);
    }

    [HttpPost("kirish")]
    public async Task<KirishJavobiDto> Kirish(KirishDto dto)
    {
        return await AuthService.LoginAsync(dto);
    }
}
