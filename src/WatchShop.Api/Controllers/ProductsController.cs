using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Dtos;
using WatchShop.Api.Enums;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/products")]
[ApiController]
[Authorize(Roles = "Admin")]
public class ProductsController : ControllerBase
{
    private readonly IProductService ProductService;
    private readonly IImageService ImageService;

    public ProductsController(IProductService productService, IImageService imageService)
    {
        ProductService = productService;
        ImageService = imageService;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<List<ProductCardDto>> GetAll([FromQuery] Category? category)
    {
        return await ProductService.GetAllAsync(category, User.IsInRole("Admin"));
    }

    [AllowAnonymous]
    [HttpGet("sales")]
    public async Task<List<ProductCardDto>> GetSales()
    {
        return await ProductService.GetSalesAsync();
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ProductDetailsDto> GetById(long id)
    {
        return await ProductService.GetByIdAsync(id);
    }

    [HttpPost("watches")]
    public async Task<long> AddWatch(WatchCreateDto dto)
    {
        return await ProductService.CreateWatchAsync(dto);
    }

    [HttpPost("caps")]
    public async Task<long> AddCap(CapCreateDto dto)
    {
        return await ProductService.CreateCapAsync(dto);
    }

    [HttpPost("rings")]
    public async Task<long> AddRing(RingCreateDto dto)
    {
        return await ProductService.CreateRingAsync(dto);
    }

    [HttpPost("bracelets")]
    public async Task<long> AddBracelet(BraceletCreateDto dto)
    {
        return await ProductService.CreateBraceletAsync(dto);
    }

    [HttpPost("glasses")]
    public async Task<long> AddGlasses(GlassesCreateDto dto)
    {
        return await ProductService.CreateGlassesAsync(dto);
    }

    [HttpPut("watches/{id}")]
    public async Task UpdateWatch(long id, WatchUpdateDto dto)
    {
        await ProductService.UpdateWatchAsync(id, dto);
    }

    [HttpPut("caps/{id}")]
    public async Task UpdateCap(long id, CapUpdateDto dto)
    {
        await ProductService.UpdateCapAsync(id, dto);
    }

    [HttpPut("rings/{id}")]
    public async Task UpdateRing(long id, RingUpdateDto dto)
    {
        await ProductService.UpdateRingAsync(id, dto);
    }

    [HttpPut("bracelets/{id}")]
    public async Task UpdateBracelet(long id, BraceletUpdateDto dto)
    {
        await ProductService.UpdateBraceletAsync(id, dto);
    }

    [HttpPut("glasses/{id}")]
    public async Task UpdateGlasses(long id, GlassesUpdateDto dto)
    {
        await ProductService.UpdateGlassesAsync(id, dto);
    }

    [HttpDelete("{id}")]
    public async Task Remove(long id)
    {
        await ProductService.DeleteAsync(id);
    }

    [HttpPost("{id}/images")]
    public async Task<ProductImageGetDto> UploadImage(long id, [FromForm] ProductImageCreateDto dto)
    {
        return await ImageService.UploadAsync(id, dto);
    }

    [HttpDelete("images/{imageId}")]
    public async Task RemoveImage(long imageId)
    {
        await ImageService.DeleteAsync(imageId);
    }
}
