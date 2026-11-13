using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Dtos;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/users")]
[ApiController]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserService UserService;

    public UsersController(IUserService userService)
    {
        UserService = userService;
    }

    [HttpGet]
    public async Task<List<UserGetDto>> GetAll()
    {
        return await UserService.GetAllAsync();
    }

    [HttpPut("{id}/role")]
    public async Task ChangeRole(long id, ChangeRoleDto dto)
    {
        await UserService.ChangeRoleAsync(id, dto);
    }
}
