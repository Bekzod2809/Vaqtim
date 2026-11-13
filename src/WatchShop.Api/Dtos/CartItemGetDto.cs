namespace WatchShop.Api.Dtos;

public class CartItemGetDto
{
    public long CartItemId { get; set; }
    public long ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal Amount { get; set; }
    public bool HasEnoughStock { get; set; }
    public string? MainImageUrl { get; set; }
}
