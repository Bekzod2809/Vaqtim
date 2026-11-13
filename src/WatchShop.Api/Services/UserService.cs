using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Exceptions;
using WatchShop.Api.Mappings;
using WatchShop.Api.Repositories;
using WatchShop.Api.Validators;

namespace WatchShop.Api.Services;

public class UserService : IUserService
{
    private readonly IBaseRepository<User> UserRepository;

    public UserService(IBaseRepository<User> userRepository)
    {
        UserRepository = userRepository;
    }

    public async Task<List<UserGetDto>> GetAllAsync()
    {
        var users = await UserRepository.GetAllQuery()
            .AsNoTracking()
            .ToListAsync();

        return users
            .Select(f => f.ToGetDto())
            .ToList();
    }

    public async Task ChangeRoleAsync(long userId, ChangeRoleDto dto)
    {
        ValidatorExtensions.ValidateEnum(dto.Role, nameof(dto.Role));

        var user = await UserRepository.GetAllQuery()
            .FirstOrDefaultAsync(f => f.UserId == userId);

        if (user == null)
        {
            throw new NotFoundException($"{userId} raqamli foydalanuvchi topilmadi.");
        }

        user.Role = dto.Role;

        UserRepository.Update(user);
        await UserRepository.SaveChangesAsync();
    }
}
