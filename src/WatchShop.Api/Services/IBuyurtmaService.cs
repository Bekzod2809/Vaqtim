using WatchShop.Api.Dtos;

namespace WatchShop.Api.Services;

public interface IBuyurtmaService
{
    Task<long> CreateAsync(long foydalanuvchiId, BuyurtmaCreateDto dto);
    Task<List<BuyurtmaGetDto>> GetMeningAsync(long foydalanuvchiId);
    Task<List<BuyurtmaGetDto>> GetAllAsync();
    Task BekorQilishAsync(long foydalanuvchiId, long buyurtmaId);
    Task HolatniOzgartirishAsync(long buyurtmaId, BuyurtmaHolatiniOzgartirishDto dto);
}
