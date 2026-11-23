using FluentValidation;
using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Configurations.Settings;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Enums;
using WatchShop.Api.Exceptions;
using WatchShop.Api.Mappings;
using WatchShop.Api.Repositories;
using WatchShop.Api.Validators;

namespace WatchShop.Api.Services;

public class AuthService : IAuthService
{
    private readonly IBaseRepository<User> UserRepository;
    private readonly ITokenService TokenService;
    private readonly IValidator<RegisterDto> RegisterValidator;
    private readonly IValidator<LoginDto> LoginValidator;
    private readonly IPhoneVerificationService PhoneVerificationService;
    private readonly AdminSettings AdminSettings;

    public AuthService(
        IBaseRepository<User> userRepository,
        ITokenService tokenService,
        IValidator<RegisterDto> registerValidator,
        IValidator<LoginDto> loginValidator,
        IPhoneVerificationService phoneVerificationService,
        AdminSettings adminSettings)
    {
        UserRepository = userRepository;
        TokenService = tokenService;
        RegisterValidator = registerValidator;
        LoginValidator = loginValidator;
        PhoneVerificationService = phoneVerificationService;
        AdminSettings = adminSettings;
    }

    public async Task<long> RegisterAsync(RegisterDto dto)
    {
        RegisterValidator.Validate(dto);

        // PostgreSQL "Bekzod" va "bekzod" ni har xil deb biladi, shuning uchun hammasini kichik harfda saqlaymiz
        dto.FirstName = dto.FirstName.Trim();
        dto.LastName = dto.LastName.Trim();
        dto.Username = Lowercase(dto.Username);
        dto.Phone = dto.Phone.Trim();

        var usernameTaken = await UserRepository.GetAllQuery()
            .AnyAsync(f => f.Username == dto.Username);

        if (usernameTaken)
        {
            throw new BadRequestException("Bu username allaqachon band.");
        }

        var phoneTaken = await UserRepository.GetAllQuery()
            .AnyAsync(f => f.Phone == dto.Phone);
        if (phoneTaken)
        {
            throw new BadRequestException("Bu telefon raqami boshqa akkauntga biriktirilgan.");
        }

        await PhoneVerificationService.VerifyAndConsumeAsync(dto.Phone, dto.VerificationCode);

        var user = dto.ToEntity(PasswordHasher.Hash(dto.Password));
        user.PhoneVerifiedAt = DateTime.UtcNow;
        if (AdminSettings.IsAdminPhone(dto.Phone))
        {
            user.Role = Role.Admin;
        }

        await UserRepository.AddAsync(user);
        await UserRepository.SaveChangesAsync();

        return user.UserId;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
    {
        LoginValidator.Validate(dto);

        var input = Lowercase(dto.Username);

        var user = await UserRepository.GetAllQuery()
            .FirstOrDefaultAsync(f => f.Username == input);

        // Qaysi biri xato ekanini aytmaymiz: begona odam username mavjudligini bilib olmasin
        if (user == null || !PasswordHasher.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedException("Username yoki parol noto'g'ri.");
        }

        return new LoginResponseDto
        {
            Token = TokenService.GetToken(user),
            User = user.ToGetDto()
        };
    }

    private static string Lowercase(string text)
    {
        return text.Trim().ToLowerInvariant();
    }
}
