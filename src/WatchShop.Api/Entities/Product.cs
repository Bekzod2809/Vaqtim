using WatchShop.Api.Enums;

namespace WatchShop.Api.Entities;

public abstract class Product
{
    public long ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public int StockQuantity { get; set; }
    public Category Category { get; set; }
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();

    public decimal CurrentPrice => SalePrice ?? Price;
}
