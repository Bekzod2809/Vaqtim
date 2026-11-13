using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Enums;

namespace WatchShop.Api.Mappings;

public static class UserMapper
{
    public static User ToEntity(this RegisterDto dto, string passwordHash)
    {
        return new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Username = dto.Username,
            PasswordHash = passwordHash,
            Role = Role.User
        };
    }

    public static UserGetDto ToGetDto(this User user)
    {
        return new UserGetDto
        {
            UserId = user.UserId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Username = user.Username,
            Role = user.Role
        };
    }
}
