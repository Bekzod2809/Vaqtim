namespace WatchShop.Api.Entities;

public class CartItem
{
    public long CartItemId { get; set; }
    public int Quantity { get; set; }
    public long UserId { get; set; }
    public User User { get; set; } = null!;
    public long ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
