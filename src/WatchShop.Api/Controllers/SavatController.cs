using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Dtos;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/savat")]
[ApiController]
[Authorize]
public class SavatController : ControllerBase
{
    private readonly ISavatService SavatService;

    public SavatController(ISavatService savatService)
    {
        SavatService = savatService;
    }

    // Foydalanuvchi Id si tokendan olinadi, so'rovdan emas: hech kim birovning savatini ko'ra olmaydi
    private long FoydalanuvchiId => long.Parse(User.FindFirst("FoydalanuvchiId")!.Value);

    [HttpGet]
    public async Task<SavatGetDto> Get()
    {
        return await SavatService.GetAsync(FoydalanuvchiId);
    }

    [HttpPost]
    public async Task Qoshish(SavatgaQoshishDto dto)
    {
        await SavatService.QoshishAsync(FoydalanuvchiId, dto);
    }

    [HttpPut("{id}")]
    public async Task SoniniOzgartirish(long id, SavatSoniniOzgartirishDto dto)
    {
        await SavatService.SoniniOzgartirishAsync(FoydalanuvchiId, id, dto);
    }

    [HttpDelete("{id}")]
    public async Task Ochirish(long id)
    {
        await SavatService.DeleteAsync(FoydalanuvchiId, id);
    }
}
