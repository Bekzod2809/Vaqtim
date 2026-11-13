using WatchShop.Api.Dtos;

namespace WatchShop.Api.Services;

public interface IOrderService
{
    Task<long> CreateAsync(long userId, OrderCreateDto dto);
    Task<List<OrderGetDto>> GetMineAsync(long userId);
    Task<List<OrderGetDto>> GetAllAsync();
    Task CancelAsync(long userId, long orderId);
    Task ChangeStatusAsync(long orderId, ChangeOrderStatusDto dto);
}
