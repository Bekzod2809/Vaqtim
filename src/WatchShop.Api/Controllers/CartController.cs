using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Dtos;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/cart")]
[ApiController]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService CartService;

    public CartController(ICartService cartService)
    {
        CartService = cartService;
    }

    // Foydalanuvchi Id si tokendan olinadi, so'rovdan emas: hech kim birovning savatini ko'ra olmaydi
    private long UserId => long.Parse(User.FindFirst("UserId")!.Value);

    [HttpGet]
    public async Task<CartGetDto> Get()
    {
        return await CartService.GetAsync(UserId);
    }

    [HttpPost]
    public async Task Add(AddToCartDto dto)
    {
        await CartService.AddAsync(UserId, dto);
    }

    [HttpPut("{id}")]
    public async Task ChangeQuantity(long id, ChangeCartQuantityDto dto)
    {
        await CartService.ChangeQuantityAsync(UserId, id, dto);
    }

    [HttpDelete("{id}")]
    public async Task Remove(long id)
    {
        await CartService.DeleteAsync(UserId, id);
    }
}
