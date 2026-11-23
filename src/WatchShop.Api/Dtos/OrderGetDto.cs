using WatchShop.Api.Enums;

namespace WatchShop.Api.Dtos;

public class OrderGetDto
{
    public long OrderId { get; set; }
    public long UserId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerUsername { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? AdditionalPhone { get; set; }
    public string? ReceiptImageUrl { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OrderItemGetDto> Items { get; set; } = new List<OrderItemGetDto>();
}
