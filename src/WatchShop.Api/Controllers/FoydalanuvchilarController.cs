using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Dtos;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/foydalanuvchilar")]
[ApiController]
[Authorize(Roles = "Admin")]
public class FoydalanuvchilarController : ControllerBase
{
    private readonly IFoydalanuvchiService FoydalanuvchiService;

    public FoydalanuvchilarController(IFoydalanuvchiService foydalanuvchiService)
    {
        FoydalanuvchiService = foydalanuvchiService;
    }

    [HttpGet]
    public async Task<List<FoydalanuvchiGetDto>> GetAll()
    {
        return await FoydalanuvchiService.GetAllAsync();
    }

    [HttpPut("{id}/rol")]
    public async Task RolniOzgartirish(long id, RolOzgartirishDto dto)
    {
        await FoydalanuvchiService.RolniOzgartirishAsync(id, dto);
    }
}
