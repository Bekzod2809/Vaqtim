using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Mappings;

public static class ProductImageMapper
{
    public static ProductImageGetDto ToGetDto(this ProductImage image)
    {
        return new ProductImageGetDto
        {
            ProductImageId = image.ProductImageId,
            ImageUrl = image.ImageUrl,
            IsMainImage = image.IsMainImage
        };
    }
}
