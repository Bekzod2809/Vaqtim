using FluentValidation;
using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Enums;
using WatchShop.Api.Exceptions;
using WatchShop.Api.Mappings;
using WatchShop.Api.Repositories;
using WatchShop.Api.Validators;

namespace WatchShop.Api.Services;

public class BuyurtmaService : IBuyurtmaService
{
    private readonly IBaseRepository<Buyurtma> BuyurtmaRepository;
    private readonly IBaseRepository<SavatMahsuloti> SavatRepository;
    private readonly IValidator<BuyurtmaCreateDto> BuyurtmaValidator;

    public BuyurtmaService(
        IBaseRepository<Buyurtma> buyurtmaRepository,
        IBaseRepository<SavatMahsuloti> savatRepository,
        IValidator<BuyurtmaCreateDto> buyurtmaValidator)
    {
        BuyurtmaRepository = buyurtmaRepository;
        SavatRepository = savatRepository;
        BuyurtmaValidator = buyurtmaValidator;
    }

    public async Task<long> CreateAsync(long foydalanuvchiId, BuyurtmaCreateDto dto)
    {
        BuyurtmaValidator.Tekshir(dto);

        var savat = await SavatRepository.GetAllQuery()
            .Include(s => s.Mahsulot)
            .Where(s => s.FoydalanuvchiId == foydalanuvchiId)
            .ToListAsync();

        if (savat.Count == 0)
        {
            throw new BadRequestException("Savat bo'sh.");
        }

        foreach (var qator in savat)
        {
            if (qator.Soni > qator.Mahsulot.OmbordagiSoni)
            {
                throw new BadRequestException($"\"{qator.Mahsulot.Nomi}\" dan omborda faqat {qator.Mahsulot.OmbordagiSoni} ta qolgan.");
            }
        }

        var buyurtma = new Buyurtma
        {
            FoydalanuvchiId = foydalanuvchiId,
            YetkazishManzili = dto.YetkazishManzili,
            Telefon = dto.Telefon,
            Holati = BuyurtmaHolati.Yangi,
            YaratilganVaqt = DateTime.UtcNow,
            Mahsulotlari = savat.Select(qator => new BuyurtmaMahsuloti
            {
                MahsulotId = qator.MahsulotId,
                MahsulotNomi = qator.Mahsulot.Nomi,
                Narxi = qator.Mahsulot.AmaldagiNarx,
                Soni = qator.Soni
            }).ToList()
        };

        buyurtma.JamiSumma = buyurtma.Mahsulotlari.Sum(bm => bm.Narxi * bm.Soni);

        foreach (var qator in savat)
        {
            qator.Mahsulot.OmbordagiSoni -= qator.Soni;
            SavatRepository.Delete(qator);
        }

        await BuyurtmaRepository.AddAsync(buyurtma);

        // Barcha repository bitta DbContext'ni ishlatadi: buyurtma, ombor va savat bitta tranzaksiyada saqlanadi
        await BuyurtmaRepository.SaveChangesAsync();

        return buyurtma.BuyurtmaId;
    }

    public async Task<List<BuyurtmaGetDto>> GetMeningAsync(long foydalanuvchiId)
    {
        var buyurtmalar = await BuyurtmaRepository.GetAllQuery()
            .Include(b => b.Mahsulotlari)
            .AsNoTracking()
            .Where(b => b.FoydalanuvchiId == foydalanuvchiId)
            .OrderByDescending(b => b.YaratilganVaqt)
            .ToListAsync();

        return buyurtmalar.Select(b => b.ToGetDto()).ToList();
    }

    public async Task<List<BuyurtmaGetDto>> GetAllAsync()
    {
        var buyurtmalar = await BuyurtmaRepository.GetAllQuery()
            .Include(b => b.Mahsulotlari)
            .AsNoTracking()
            .OrderByDescending(b => b.YaratilganVaqt)
            .ToListAsync();

        return buyurtmalar.Select(b => b.ToGetDto()).ToList();
    }

    public async Task BekorQilishAsync(long foydalanuvchiId, long buyurtmaId)
    {
        var buyurtma = await TopishAsync(buyurtmaId);

        if (buyurtma.FoydalanuvchiId != foydalanuvchiId)
        {
            throw new NotFoundException($"{buyurtmaId} raqamli buyurtma topilmadi.");
        }

        if (buyurtma.Holati != BuyurtmaHolati.Yangi)
        {
            throw new BadRequestException("Faqat \"Yangi\" holatdagi buyurtmani bekor qilish mumkin.");
        }

        OmborgaQaytarish(buyurtma);
        buyurtma.Holati = BuyurtmaHolati.BekorQilingan;

        BuyurtmaRepository.Update(buyurtma);
        await BuyurtmaRepository.SaveChangesAsync();
    }

    public async Task HolatniOzgartirishAsync(long buyurtmaId, BuyurtmaHolatiniOzgartirishDto dto)
    {
        ValidatorExtensions.EnumTekshir(dto.Holati, nameof(dto.Holati));

        var buyurtma = await TopishAsync(buyurtmaId);

        if (buyurtma.Holati == BuyurtmaHolati.Yetkazilgan || buyurtma.Holati == BuyurtmaHolati.BekorQilingan)
        {
            throw new BadRequestException("Yakunlangan buyurtmaning holatini o'zgartirib bo'lmaydi.");
        }

        // Holat faqat oldinga yuradi: Yangi -> Tasdiqlangan -> Yetkazilgan, yoki istalgan paytda BekorQilingan
        if (dto.Holati <= buyurtma.Holati)
        {
            throw new BadRequestException("Buyurtma holatini faqat oldinga o'zgartirish mumkin.");
        }

        if (dto.Holati == BuyurtmaHolati.BekorQilingan)
        {
            OmborgaQaytarish(buyurtma);
        }

        buyurtma.Holati = dto.Holati;

        BuyurtmaRepository.Update(buyurtma);
        await BuyurtmaRepository.SaveChangesAsync();
    }

    private async Task<Buyurtma> TopishAsync(long buyurtmaId)
    {
        var buyurtma = await BuyurtmaRepository.GetAllQuery()
            .Include(b => b.Mahsulotlari)
                .ThenInclude(bm => bm.Mahsulot)
            .FirstOrDefaultAsync(b => b.BuyurtmaId == buyurtmaId);

        if (buyurtma == null)
        {
            throw new NotFoundException($"{buyurtmaId} raqamli buyurtma topilmadi.");
        }

        return buyurtma;
    }

    // Bekor qilingan buyurtmadagi mahsulotlar omborga qaytadi, aks holda ular "yo'qolib" qoladi
    private static void OmborgaQaytarish(Buyurtma buyurtma)
    {
        foreach (var bm in buyurtma.Mahsulotlari)
        {
            if (bm.Mahsulot != null)
            {
                bm.Mahsulot.OmbordagiSoni += bm.Soni;
            }
        }
    }
}
