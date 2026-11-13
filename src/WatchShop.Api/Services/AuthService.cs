using FluentValidation;
using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
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

    public AuthService(
        IBaseRepository<User> userRepository,
        ITokenService tokenService,
        IValidator<RegisterDto> registerValidator,
        IValidator<LoginDto> loginValidator)
    {
        UserRepository = userRepository;
        TokenService = tokenService;
        RegisterValidator = registerValidator;
        LoginValidator = loginValidator;
    }

    public async Task<long> RegisterAsync(RegisterDto dto)
    {
        RegisterValidator.Validate(dto);

        // PostgreSQL "Bekzod" va "bekzod" ni har xil deb biladi, shuning uchun hammasini kichik harfda saqlaymiz
        dto.Username = Lowercase(dto.Username);
        dto.Email = Lowercase(dto.Email);

        var usernameTaken = await UserRepository.GetAllQuery()
            .AnyAsync(f => f.Username == dto.Username);

        if (usernameTaken)
        {
            throw new BadRequestException("Bu username allaqachon band.");
        }

        var emailTaken = await UserRepository.GetAllQuery()
            .AnyAsync(f => f.Email == dto.Email);

        if (emailTaken)
        {
            throw new BadRequestException("Bu email allaqachon ro'yxatdan o'tgan.");
        }

        var user = dto.ToEntity(PasswordHasher.Hash(dto.Password));

        await UserRepository.AddAsync(user);
        await UserRepository.SaveChangesAsync();

        return user.UserId;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
    {
        LoginValidator.Validate(dto);

        var input = Lowercase(dto.UsernameOrEmail);

        var user = await UserRepository.GetAllQuery()
            .FirstOrDefaultAsync(f => f.Username == input || f.Email == input);

        // Qaysi biri xato ekanini aytmaymiz: begona odam username mavjudligini bilib olmasin
        if (user == null || !PasswordHasher.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedException("Username/email yoki parol noto'g'ri.");
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
