using WatchShop.Api.Dtos;
using WatchShop.Api.Enums;

namespace WatchShop.Api.Services;

public interface IMahsulotService
{
    Task<List<MahsulotKartaDto>> GetAllAsync(Kategoriya? kategoriya, bool adminmi);
    Task<List<MahsulotKartaDto>> GetChegirmalarAsync();
    Task<MahsulotBatafsilDto> GetByIdAsync(long mahsulotId);

    Task<long> CreateSoatAsync(SoatCreateDto dto);
    Task<long> CreateKepkaAsync(KepkaCreateDto dto);
    Task<long> CreateUzukAsync(UzukCreateDto dto);
    Task<long> CreateBilaguzukAsync(BilaguzukCreateDto dto);
    Task<long> CreateKozoynakAsync(KozoynakCreateDto dto);

    Task UpdateSoatAsync(long mahsulotId, SoatUpdateDto dto);
    Task UpdateKepkaAsync(long mahsulotId, KepkaUpdateDto dto);
    Task UpdateUzukAsync(long mahsulotId, UzukUpdateDto dto);
    Task UpdateBilaguzukAsync(long mahsulotId, BilaguzukUpdateDto dto);
    Task UpdateKozoynakAsync(long mahsulotId, KozoynakUpdateDto dto);

    Task DeleteAsync(long mahsulotId);
}
