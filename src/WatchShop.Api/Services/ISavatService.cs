using WatchShop.Api.Dtos;

namespace WatchShop.Api.Services;

public interface ISavatService
{
    Task<SavatGetDto> GetAsync(long foydalanuvchiId);
    Task QoshishAsync(long foydalanuvchiId, SavatgaQoshishDto dto);
    Task SoniniOzgartirishAsync(long foydalanuvchiId, long savatMahsulotiId, SavatSoniniOzgartirishDto dto);
    Task DeleteAsync(long foydalanuvchiId, long savatMahsulotiId);
}
