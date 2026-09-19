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
    private readonly IBaseRepository<Foydalanuvchi> FoydalanuvchiRepository;
    private readonly ITokenService TokenService;
    private readonly IValidator<RoyxatdanOtishDto> RoyxatdanOtishValidator;
    private readonly IValidator<KirishDto> KirishValidator;

    public AuthService(
        IBaseRepository<Foydalanuvchi> foydalanuvchiRepository,
        ITokenService tokenService,
        IValidator<RoyxatdanOtishDto> royxatdanOtishValidator,
        IValidator<KirishDto> kirishValidator)
    {
        FoydalanuvchiRepository = foydalanuvchiRepository;
        TokenService = tokenService;
        RoyxatdanOtishValidator = royxatdanOtishValidator;
        KirishValidator = kirishValidator;
    }

    public async Task<long> RegisterAsync(RoyxatdanOtishDto dto)
    {
        RoyxatdanOtishValidator.Tekshir(dto);

        // PostgreSQL "Bekzod" va "bekzod" ni har xil deb biladi, shuning uchun hammasini kichik harfda saqlaymiz
        dto.Username = Kichik(dto.Username);
        dto.Email = Kichik(dto.Email);

        var usernameBand = await FoydalanuvchiRepository.GetAllQuery()
            .AnyAsync(f => f.Username == dto.Username);

        if (usernameBand)
        {
            throw new BadRequestException("Bu username allaqachon band.");
        }

        var emailBand = await FoydalanuvchiRepository.GetAllQuery()
            .AnyAsync(f => f.Email == dto.Email);

        if (emailBand)
        {
            throw new BadRequestException("Bu email allaqachon ro'yxatdan o'tgan.");
        }

        var foydalanuvchi = dto.ToEntity(ParolHasher.Hash(dto.Parol));

        await FoydalanuvchiRepository.AddAsync(foydalanuvchi);
        await FoydalanuvchiRepository.SaveChangesAsync();

        return foydalanuvchi.FoydalanuvchiId;
    }

    public async Task<KirishJavobiDto> LoginAsync(KirishDto dto)
    {
        KirishValidator.Tekshir(dto);

        var kiritilgan = Kichik(dto.UsernameYokiEmail);

        var foydalanuvchi = await FoydalanuvchiRepository.GetAllQuery()
            .FirstOrDefaultAsync(f => f.Username == kiritilgan || f.Email == kiritilgan);

        // Qaysi biri xato ekanini aytmaymiz: begona odam username mavjudligini bilib olmasin
        if (foydalanuvchi == null || !ParolHasher.Verify(dto.Parol, foydalanuvchi.ParolHash))
        {
            throw new UnauthorizedException("Username/email yoki parol noto'g'ri.");
        }

        return new KirishJavobiDto
        {
            Token = TokenService.GetToken(foydalanuvchi),
            Foydalanuvchi = foydalanuvchi.ToGetDto()
        };
    }

    private static string Kichik(string matn)
    {
        return matn.Trim().ToLowerInvariant();
    }
}
