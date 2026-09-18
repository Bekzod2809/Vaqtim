using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Enums;

namespace WatchShop.Api.Mappings;

public static class FoydalanuvchiMapper
{
    public static Foydalanuvchi ToEntity(this RoyxatdanOtishDto dto, string parolHash)
    {
        return new Foydalanuvchi
        {
            Ism = dto.Ism,
            Familiya = dto.Familiya,
            Email = dto.Email,
            Username = dto.Username,
            ParolHash = parolHash,
            Rol = Rol.User
        };
    }

    public static FoydalanuvchiGetDto ToGetDto(this Foydalanuvchi foydalanuvchi)
    {
        return new FoydalanuvchiGetDto
        {
            FoydalanuvchiId = foydalanuvchi.FoydalanuvchiId,
            Ism = foydalanuvchi.Ism,
            Familiya = foydalanuvchi.Familiya,
            Email = foydalanuvchi.Email,
            Username = foydalanuvchi.Username,
            Rol = foydalanuvchi.Rol
        };
    }
}
