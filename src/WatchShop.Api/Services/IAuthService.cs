using WatchShop.Api.Dtos;

namespace WatchShop.Api.Services;

public interface IAuthService
{
    Task<long> RegisterAsync(RoyxatdanOtishDto dto);
    Task<KirishJavobiDto> LoginAsync(KirishDto dto);
}
