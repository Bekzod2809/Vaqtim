using WatchShop.Api.Dtos;

namespace WatchShop.Api.Services;

public interface IFoydalanuvchiService
{
    Task<List<FoydalanuvchiGetDto>> GetAllAsync();
    Task RolniOzgartirishAsync(long foydalanuvchiId, RolOzgartirishDto dto);
}
