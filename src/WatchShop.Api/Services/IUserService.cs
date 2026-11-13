using WatchShop.Api.Dtos;

namespace WatchShop.Api.Services;

public interface IUserService
{
    Task<List<UserGetDto>> GetAllAsync();
    Task ChangeRoleAsync(long userId, ChangeRoleDto dto);
}
