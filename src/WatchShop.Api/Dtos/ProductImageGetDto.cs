namespace WatchShop.Api.Dtos;

public class ProductImageGetDto
{
    public long ProductImageId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsMainImage { get; set; }
}
