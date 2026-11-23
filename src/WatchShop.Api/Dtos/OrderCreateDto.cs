using Microsoft.AspNetCore.Http;

namespace WatchShop.Api.Dtos;

public class OrderCreateDto
{
    public string DeliveryAddress { get; set; } = string.Empty;
    public string? AdditionalPhone { get; set; }
    public IFormFile? ReceiptImage { get; set; }
}
