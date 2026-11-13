namespace WatchShop.Api.Dtos;

public class CartGetDto
{
    public List<CartItemGetDto> Products { get; set; } = new List<CartItemGetDto>();
    public decimal TotalAmount { get; set; }
}
