using WatchShop.Api.Dtos;

namespace WatchShop.Api.Services;

public interface IUserService
{
    Task<List<UserGetDto>> GetAllAsync();
    Task<UserGetDto> UpdateMyProfileAsync(long userId, UpdateProfileDto dto);
    Task ChangeRoleAsync(long userId, ChangeRoleDto dto);
}
