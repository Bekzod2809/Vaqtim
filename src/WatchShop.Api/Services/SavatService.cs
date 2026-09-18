using FluentValidation;
using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Exceptions;
using WatchShop.Api.Mappings;
using WatchShop.Api.Repositories;
using WatchShop.Api.Validators;

namespace WatchShop.Api.Services;

public class SavatService : ISavatService
{
    private readonly IBaseRepository<SavatMahsuloti> SavatRepository;
    private readonly IBaseRepository<Mahsulot> MahsulotRepository;
    private readonly IValidator<SavatgaQoshishDto> QoshishValidator;
    private readonly IValidator<SavatSoniniOzgartirishDto> SoniValidator;

    public SavatService(
        IBaseRepository<SavatMahsuloti> savatRepository,
        IBaseRepository<Mahsulot> mahsulotRepository,
        IValidator<SavatgaQoshishDto> qoshishValidator,
        IValidator<SavatSoniniOzgartirishDto> soniValidator)
    {
        SavatRepository = savatRepository;
        MahsulotRepository = mahsulotRepository;
        QoshishValidator = qoshishValidator;
        SoniValidator = soniValidator;
    }

    public async Task<SavatGetDto> GetAsync(long foydalanuvchiId)
    {
        var qatorlar = await SavatRepository.GetAllQuery()
            .Include(s => s.Mahsulot)
                .ThenInclude(m => m.Rasmlari)
            .AsNoTracking()
            .Where(s => s.FoydalanuvchiId == foydalanuvchiId)
            .ToListAsync();

        return qatorlar.ToSavatDto();
    }

    public async Task QoshishAsync(long foydalanuvchiId, SavatgaQoshishDto dto)
    {
        QoshishValidator.Tekshir(dto);

        var mahsulot = await MahsulotRepository.GetAllQuery()
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.MahsulotId == dto.MahsulotId);

        if (mahsulot == null)
        {
            throw new NotFoundException($"{dto.MahsulotId} raqamli mahsulot topilmadi.");
        }

        var mavjudQator = await SavatRepository.GetAllQuery()
            .FirstOrDefaultAsync(s => s.FoydalanuvchiId == foydalanuvchiId && s.MahsulotId == dto.MahsulotId);

        // Mahsulot savatda bo'lsa yangi qator ochilmaydi, soni oshiriladi
        var yangiSoni = (mavjudQator?.Soni ?? 0) + dto.Soni;
        OmborniTekshirish(mahsulot, yangiSoni);

        if (mavjudQator == null)
        {
            await SavatRepository.AddAsync(new SavatMahsuloti
            {
                FoydalanuvchiId = foydalanuvchiId,
                MahsulotId = dto.MahsulotId,
                Soni = yangiSoni
            });
        }
        else
        {
            mavjudQator.Soni = yangiSoni;
            SavatRepository.Update(mavjudQator);
        }

        await SavatRepository.SaveChangesAsync();
    }

    public async Task SoniniOzgartirishAsync(long foydalanuvchiId, long savatMahsulotiId, SavatSoniniOzgartirishDto dto)
    {
        SoniValidator.Tekshir(dto);

        var qator = await TopishAsync(foydalanuvchiId, savatMahsulotiId);
        OmborniTekshirish(qator.Mahsulot, dto.Soni);

        qator.Soni = dto.Soni;
        SavatRepository.Update(qator);
        await SavatRepository.SaveChangesAsync();
    }

    public async Task DeleteAsync(long foydalanuvchiId, long savatMahsulotiId)
    {
        var qator = await TopishAsync(foydalanuvchiId, savatMahsulotiId);

        SavatRepository.Delete(qator);
        await SavatRepository.SaveChangesAsync();
    }

    // FoydalanuvchiId sharti tufayli birov boshqaning savatiga tegolmaydi: begona qator "topilmadi" bo'ladi
    private async Task<SavatMahsuloti> TopishAsync(long foydalanuvchiId, long savatMahsulotiId)
    {
        var qator = await SavatRepository.GetAllQuery()
            .Include(s => s.Mahsulot)
            .FirstOrDefaultAsync(s => s.SavatMahsulotiId == savatMahsulotiId && s.FoydalanuvchiId == foydalanuvchiId);

        if (qator == null)
        {
            throw new NotFoundException($"Savatda {savatMahsulotiId} raqamli qator topilmadi.");
        }

        return qator;
    }

    private static void OmborniTekshirish(Mahsulot mahsulot, int kerakliSoni)
    {
        if (kerakliSoni > mahsulot.OmbordagiSoni)
        {
            throw new BadRequestException($"\"{mahsulot.Nomi}\" dan omborda faqat {mahsulot.OmbordagiSoni} ta qolgan.");
        }
    }
}
