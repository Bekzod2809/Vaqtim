namespace WatchShop.Api.Entities;

public class ProductImage
{
    public long ProductImageId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsMainImage { get; set; }
    public long ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
