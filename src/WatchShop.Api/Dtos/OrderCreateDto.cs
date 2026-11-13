namespace WatchShop.Api.Dtos;

public class OrderCreateDto
{
    public string DeliveryAddress { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}
