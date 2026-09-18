using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Services;

public interface IRasmService
{
    Task<MahsulotRasmiGetDto> YuklashAsync(long mahsulotId, MahsulotRasmiCreateDto dto);
    Task DeleteAsync(long mahsulotRasmiId);
    void FayllarniOchirish(IEnumerable<MahsulotRasmi> rasmlar);
}
