using WatchShop.Api.Dtos;
using WatchShop.Api.Enums;

namespace WatchShop.Api.Services;

public interface IProductService
{
    Task<List<ProductCardDto>> GetAllAsync(Category? category, bool isAdmin);
    Task<List<ProductCardDto>> GetSalesAsync();
    Task<ProductDetailsDto> GetByIdAsync(long productId);

    Task<long> CreateWatchAsync(WatchCreateDto dto);
    Task<long> CreateCapAsync(CapCreateDto dto);
    Task<long> CreateRingAsync(RingCreateDto dto);
    Task<long> CreateBraceletAsync(BraceletCreateDto dto);
    Task<long> CreateGlassesAsync(GlassesCreateDto dto);

    Task UpdateWatchAsync(long productId, WatchUpdateDto dto);
    Task UpdateCapAsync(long productId, CapUpdateDto dto);
    Task UpdateRingAsync(long productId, RingUpdateDto dto);
    Task UpdateBraceletAsync(long productId, BraceletUpdateDto dto);
    Task UpdateGlassesAsync(long productId, GlassesUpdateDto dto);

    Task DeleteAsync(long productId);
}
