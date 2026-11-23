using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Mappings;

public static class OrderMapper
{
    public static OrderGetDto ToGetDto(this Order order)
    {
        return new OrderGetDto
        {
            OrderId = order.OrderId,
            UserId = order.UserId,
            CustomerName = order.User != null ? $"{order.User.FirstName} {order.User.LastName}".Trim() : string.Empty,
            CustomerUsername = order.User?.Username ?? string.Empty,
            DeliveryAddress = order.DeliveryAddress,
            Phone = order.Phone,
            AdditionalPhone = order.AdditionalPhone,
            ReceiptImageUrl = order.ReceiptImageUrl,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            CreatedAt = order.CreatedAt,
            Items = order.Items.Select(bm => new OrderItemGetDto
            {
                ProductId = bm.ProductId,
                ProductName = bm.ProductName,
                Price = bm.Price,
                Quantity = bm.Quantity,
                Amount = bm.Price * bm.Quantity
            }).ToList()
        };
    }
}
