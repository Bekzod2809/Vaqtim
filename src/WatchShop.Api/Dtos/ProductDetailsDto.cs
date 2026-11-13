using WatchShop.Api.Enums;

namespace WatchShop.Api.Dtos;

public class ProductDetailsDto
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
    public MovementType? Movement { get; set; }
    public CapType? CapType { get; set; }
    public List<ProductImageGetDto> Images { get; set; } = new List<ProductImageGetDto>();
}
