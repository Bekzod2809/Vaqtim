namespace WatchShop.Api.Dtos;

public class AddToCartDto
{
    public long ProductId { get; set; }
    public int Quantity { get; set; } = 1;
}
