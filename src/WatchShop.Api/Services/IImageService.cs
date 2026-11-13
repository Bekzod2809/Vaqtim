using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Services;

public interface IImageService
{
    Task<ProductImageGetDto> UploadAsync(long productId, ProductImageCreateDto dto);
    Task DeleteAsync(long productImageId);
    void RemoveFiles(IEnumerable<ProductImage> images);
}
