using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Dtos;
using WatchShop.Api.Enums;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/mahsulotlar")]
[ApiController]
[Authorize(Roles = "Admin")]
public class MahsulotlarController : ControllerBase
{
    private readonly IMahsulotService MahsulotService;
    private readonly IRasmService RasmService;

    public MahsulotlarController(IMahsulotService mahsulotService, IRasmService rasmService)
    {
        MahsulotService = mahsulotService;
        RasmService = rasmService;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<List<MahsulotKartaDto>> GetAll([FromQuery] Kategoriya? kategoriya)
    {
        return await MahsulotService.GetAllAsync(kategoriya, User.IsInRole("Admin"));
    }

    [AllowAnonymous]
    [HttpGet("chegirmalar")]
    public async Task<List<MahsulotKartaDto>> GetChegirmalar()
    {
        return await MahsulotService.GetChegirmalarAsync();
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<MahsulotBatafsilDto> GetById(long id)
    {
        return await MahsulotService.GetByIdAsync(id);
    }

    [HttpPost("soatlar")]
    public async Task<long> SoatQoshish(SoatCreateDto dto)
    {
        return await MahsulotService.CreateSoatAsync(dto);
    }

    [HttpPost("kepkalar")]
    public async Task<long> KepkaQoshish(KepkaCreateDto dto)
    {
        return await MahsulotService.CreateKepkaAsync(dto);
    }

    [HttpPost("uzuklar")]
    public async Task<long> UzukQoshish(UzukCreateDto dto)
    {
        return await MahsulotService.CreateUzukAsync(dto);
    }

    [HttpPost("bilaguzuklar")]
    public async Task<long> BilaguzukQoshish(BilaguzukCreateDto dto)
    {
        return await MahsulotService.CreateBilaguzukAsync(dto);
    }

    [HttpPost("kozoynaklar")]
    public async Task<long> KozoynakQoshish(KozoynakCreateDto dto)
    {
        return await MahsulotService.CreateKozoynakAsync(dto);
    }

    [HttpPut("soatlar/{id}")]
    public async Task SoatYangilash(long id, SoatUpdateDto dto)
    {
        await MahsulotService.UpdateSoatAsync(id, dto);
    }

    [HttpPut("kepkalar/{id}")]
    public async Task KepkaYangilash(long id, KepkaUpdateDto dto)
    {
        await MahsulotService.UpdateKepkaAsync(id, dto);
    }

    [HttpPut("uzuklar/{id}")]
    public async Task UzukYangilash(long id, UzukUpdateDto dto)
    {
        await MahsulotService.UpdateUzukAsync(id, dto);
    }

    [HttpPut("bilaguzuklar/{id}")]
    public async Task BilaguzukYangilash(long id, BilaguzukUpdateDto dto)
    {
        await MahsulotService.UpdateBilaguzukAsync(id, dto);
    }

    [HttpPut("kozoynaklar/{id}")]
    public async Task KozoynakYangilash(long id, KozoynakUpdateDto dto)
    {
        await MahsulotService.UpdateKozoynakAsync(id, dto);
    }

    [HttpDelete("{id}")]
    public async Task Ochirish(long id)
    {
        await MahsulotService.DeleteAsync(id);
    }

    [HttpPost("{id}/rasmlar")]
    public async Task<MahsulotRasmiGetDto> RasmYuklash(long id, [FromForm] MahsulotRasmiCreateDto dto)
    {
        return await RasmService.YuklashAsync(id, dto);
    }

    [HttpDelete("rasmlar/{rasmId}")]
    public async Task RasmOchirish(long rasmId)
    {
        await RasmService.DeleteAsync(rasmId);
    }
}
