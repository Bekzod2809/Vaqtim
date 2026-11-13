using WatchShop.Api.Enums;

namespace WatchShop.Api.Dtos;

public class ProductCardDto
{
    public long ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public int StockQuantity { get; set; }
    public Category Category { get; set; }
    public string? MainImageUrl { get; set; }
}
