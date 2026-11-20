using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Exceptions;
using WatchShop.Api.Mappings;
using WatchShop.Api.Repositories;
using WatchShop.Api.Validators;
using FluentValidation;

namespace WatchShop.Api.Services;

public class UserService : IUserService
{
    private readonly IBaseRepository<User> UserRepository;
    private readonly IValidator<UpdateProfileDto> ProfileValidator;
    private readonly IPhoneVerificationService PhoneVerificationService;

    public UserService(
        IBaseRepository<User> userRepository,
        IValidator<UpdateProfileDto> profileValidator,
        IPhoneVerificationService phoneVerificationService)
    {
        UserRepository = userRepository;
        ProfileValidator = profileValidator;
        PhoneVerificationService = phoneVerificationService;
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

    public async Task<UserGetDto> UpdateMyProfileAsync(long userId, UpdateProfileDto dto)
    {
        ProfileValidator.Validate(dto);

        dto.FirstName = dto.FirstName.Trim();
        dto.LastName = dto.LastName.Trim();
        dto.Phone = dto.Phone.Trim();
        dto.Username = dto.Username.Trim().ToLowerInvariant();

        var user = await UserRepository.GetAllQuery()
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (user == null)
        {
            throw new NotFoundException("Foydalanuvchi topilmadi.");
        }

        if (await UserRepository.GetAllQuery().AnyAsync(x => x.UserId != userId && x.Username == dto.Username))
        {
            throw new BadRequestException("Bu username allaqachon band.");
        }

        var phoneChangedOrUnverified = user.Phone != dto.Phone || user.PhoneVerifiedAt == null;
        if (phoneChangedOrUnverified)
        {
            if (await UserRepository.GetAllQuery().AnyAsync(x => x.UserId != userId && x.Phone == dto.Phone))
            {
                throw new BadRequestException("Bu telefon raqami boshqa akkauntga biriktirilgan.");
            }

            if (string.IsNullOrWhiteSpace(dto.VerificationCode))
            {
                throw new BadRequestException("Telefon raqamini tasdiqlash uchun Telegram botdan kod oling.");
            }

            await PhoneVerificationService.VerifyAndConsumeAsync(dto.Phone, dto.VerificationCode);
            user.PhoneVerifiedAt = DateTime.UtcNow;
        }

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Phone = dto.Phone;
        user.Username = dto.Username;
        UserRepository.Update(user);
        await UserRepository.SaveChangesAsync();
        return user.ToGetDto();
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
