using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Mappings;

public static class OrderMapper
{
    public static OrderGetDto ToGetDto(this Order order)
    {
        var items = new List<OrderItemGetDto>();

        foreach (var bm in order.Items)
        {
            string? mainImage = null;
            if (bm.Product != null)
            {
                foreach (var img in bm.Product.Images)
                {
                    if (mainImage == null || img.IsMainImage)
                    {
                        mainImage = img.ImageUrl;
                        if (img.IsMainImage)
                        {
                            break;
                        }
                    }
                }
            }

            items.Add(new OrderItemGetDto
            {
                ProductId = bm.ProductId,
                ProductName = bm.ProductName,
                MainImageUrl = mainImage,
                Price = bm.Price,
                Quantity = bm.Quantity,
                Amount = bm.Price * bm.Quantity
            });
        }

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
            Items = items
        };
    }
}
