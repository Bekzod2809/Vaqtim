using WatchShop.Api.Entities;

namespace WatchShop.Api.Services;

public interface ITokenService
{
    string GetToken(Foydalanuvchi foydalanuvchi);
}
