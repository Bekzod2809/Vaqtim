using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchShop.Api.Dtos;
using WatchShop.Api.Services;

namespace WatchShop.Api.Controllers;

[Route("api/orders")]
[ApiController]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService OrderService;

    public OrdersController(IOrderService orderService)
    {
        OrderService = orderService;
    }

    private long UserId => long.Parse(User.FindFirst("UserId")!.Value);

    [HttpPost]
    public async Task<long> PlaceOrder([FromForm] OrderCreateDto dto)
    {
        return await OrderService.CreateAsync(UserId, dto);
    }

    [HttpGet("mine")]
    public async Task<List<OrderGetDto>> GetMine()
    {
        return await OrderService.GetMineAsync(UserId);
    }

    [HttpPut("{id}/cancel")]
    public async Task Cancel(long id)
    {
        await OrderService.CancelAsync(UserId, id);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<List<OrderGetDto>> GetAll()
    {
        return await OrderService.GetAllAsync();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/status")]
    public async Task ChangeStatus(long id, ChangeOrderStatusDto dto)
    {
        await OrderService.ChangeStatusAsync(id, dto);
    }
}
