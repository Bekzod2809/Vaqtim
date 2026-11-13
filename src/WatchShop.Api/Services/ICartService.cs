using WatchShop.Api.Dtos;

namespace WatchShop.Api.Services;

public interface ICartService
{
    Task<CartGetDto> GetAsync(long userId);
    Task AddAsync(long userId, AddToCartDto dto);
    Task ChangeQuantityAsync(long userId, long cartItemId, ChangeCartQuantityDto dto);
    Task DeleteAsync(long userId, long cartItemId);
}
