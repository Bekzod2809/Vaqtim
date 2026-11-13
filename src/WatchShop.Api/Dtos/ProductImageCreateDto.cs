namespace WatchShop.Api.Dtos;

public class ProductImageCreateDto
{
    public IFormFile Image { get; set; } = null!;
    public bool IsMainImage { get; set; }
}
