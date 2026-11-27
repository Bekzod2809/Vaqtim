namespace WatchShop.Api.Dtos;

public class OrderItemGetDto
{
    public long? ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? MainImageUrl { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal Amount { get; set; }
}
