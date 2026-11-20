using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Dtos;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/account")]
[ApiController]
[Authorize]
public class AccountController : ControllerBase
{
    private readonly IUserService UserService;

    public AccountController(IUserService userService)
    {
        UserService = userService;
    }

    [HttpPut("profile")]
    public async Task<UserGetDto> UpdateProfile(UpdateProfileDto dto)
    {
        var userId = long.Parse(User.FindFirst("UserId")!.Value);
        return await UserService.UpdateMyProfileAsync(userId, dto);
    }
}
