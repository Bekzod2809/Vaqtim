using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Dtos;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/buyurtmalar")]
[ApiController]
[Authorize]
public class BuyurtmalarController : ControllerBase
{
    private readonly IBuyurtmaService BuyurtmaService;

    public BuyurtmalarController(IBuyurtmaService buyurtmaService)
    {
        BuyurtmaService = buyurtmaService;
    }

    private long FoydalanuvchiId => long.Parse(User.FindFirst("FoydalanuvchiId")!.Value);

    [HttpPost]
    public async Task<long> BuyurtmaBerish(BuyurtmaCreateDto dto)
    {
        return await BuyurtmaService.CreateAsync(FoydalanuvchiId, dto);
    }

    [HttpGet("mening")]
    public async Task<List<BuyurtmaGetDto>> GetMening()
    {
        return await BuyurtmaService.GetMeningAsync(FoydalanuvchiId);
    }

    [HttpPut("{id}/bekor-qilish")]
    public async Task BekorQilish(long id)
    {
        await BuyurtmaService.BekorQilishAsync(FoydalanuvchiId, id);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<List<BuyurtmaGetDto>> GetAll()
    {
        return await BuyurtmaService.GetAllAsync();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/holat")]
    public async Task HolatniOzgartirish(long id, BuyurtmaHolatiniOzgartirishDto dto)
    {
        await BuyurtmaService.HolatniOzgartirishAsync(id, dto);
    }
}
