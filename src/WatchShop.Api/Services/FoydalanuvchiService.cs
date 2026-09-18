using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Exceptions;
using WatchShop.Api.Mappings;
using WatchShop.Api.Repositories;
using WatchShop.Api.Validators;

namespace WatchShop.Api.Services;

public class FoydalanuvchiService : IFoydalanuvchiService
{
    private readonly IBaseRepository<Foydalanuvchi> FoydalanuvchiRepository;

    public FoydalanuvchiService(IBaseRepository<Foydalanuvchi> foydalanuvchiRepository)
    {
        FoydalanuvchiRepository = foydalanuvchiRepository;
    }

    public async Task<List<FoydalanuvchiGetDto>> GetAllAsync()
    {
        var foydalanuvchilar = await FoydalanuvchiRepository.GetAllQuery()
            .AsNoTracking()
            .ToListAsync();

        return foydalanuvchilar
            .Select(f => f.ToGetDto())
            .ToList();
    }

    public async Task RolniOzgartirishAsync(long foydalanuvchiId, RolOzgartirishDto dto)
    {
        ValidatorExtensions.EnumTekshir(dto.Rol, nameof(dto.Rol));

        var foydalanuvchi = await FoydalanuvchiRepository.GetAllQuery()
            .FirstOrDefaultAsync(f => f.FoydalanuvchiId == foydalanuvchiId);

        if (foydalanuvchi == null)
        {
            throw new NotFoundException($"{foydalanuvchiId} raqamli foydalanuvchi topilmadi.");
        }

        foydalanuvchi.Rol = dto.Rol;

        FoydalanuvchiRepository.Update(foydalanuvchi);
        await FoydalanuvchiRepository.SaveChangesAsync();
    }
}
