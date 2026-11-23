using WatchShop.Api.Dtos;

namespace WatchShop.Api.Services;

public interface IAuthService
{
    Task<long> RegisterAsync(RegisterDto dto);
    Task<LoginResponseDto> LoginAsync(LoginDto dto);
    Task<LoginResponseDto> ResetPasswordAsync(ResetPasswordDto dto);
}
