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

public class MahsulotService : IMahsulotService
{
    private readonly IBaseRepository<Mahsulot> MahsulotRepository;
    private readonly IRasmService RasmService;
    private readonly IValidator<IMahsulotYozishDto> MahsulotValidator;

    public MahsulotService(
        IBaseRepository<Mahsulot> mahsulotRepository,
        IRasmService rasmService,
        IValidator<IMahsulotYozishDto> mahsulotValidator)
    {
        MahsulotRepository = mahsulotRepository;
        RasmService = rasmService;
        MahsulotValidator = mahsulotValidator;
    }

    public async Task<List<MahsulotKartaDto>> GetAllAsync(Kategoriya? kategoriya, bool adminmi)
    {
        var query = MahsulotRepository.GetAllQuery()
            .Include(m => m.Rasmlari)
            .AsNoTracking();

        // Tugagan mahsulot saytdan yo'qoladi, lekin admin uni ko'rib, qayta to'ldira olishi kerak
        if (!adminmi)
        {
            query = query.Where(m => m.OmbordagiSoni > 0);
        }

        if (kategoriya.HasValue)
        {
            query = query.Where(m => m.Kategoriya == kategoriya.Value);
        }

        var mahsulotlar = await query.ToListAsync();

        return mahsulotlar
            .Select(m => m.ToKartaDto())
            .ToList();
    }

    public async Task<List<MahsulotKartaDto>> GetChegirmalarAsync()
    {
        var mahsulotlar = await MahsulotRepository.GetAllQuery()
            .Include(m => m.Rasmlari)
            .AsNoTracking()
            .Where(m => m.ChegirmaNarxi != null && m.OmbordagiSoni > 0)
            .ToListAsync();

        return mahsulotlar
            .Select(m => m.ToKartaDto())
            .ToList();
    }

    public async Task<MahsulotBatafsilDto> GetByIdAsync(long mahsulotId)
    {
        var mahsulot = await MahsulotRepository.GetAllQuery()
            .Include(m => m.Rasmlari)
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.MahsulotId == mahsulotId);

        if (mahsulot == null)
        {
            throw new NotFoundException($"{mahsulotId} raqamli mahsulot topilmadi.");
        }

        return mahsulot.ToBatafsilDto();
    }

    public async Task<long> CreateSoatAsync(SoatCreateDto dto)
    {
        MahsulotValidator.Tekshir(dto);
        ValidatorExtensions.EnumTekshir(dto.Mexanizmi, nameof(dto.Mexanizmi));
        return await QoshishAsync(dto.ToEntity());
    }

    public async Task<long> CreateKepkaAsync(KepkaCreateDto dto)
    {
        MahsulotValidator.Tekshir(dto);
        ValidatorExtensions.EnumTekshir(dto.Turi, nameof(dto.Turi));
        return await QoshishAsync(dto.ToEntity());
    }

    public async Task<long> CreateUzukAsync(UzukCreateDto dto)
    {
        MahsulotValidator.Tekshir(dto);
        return await QoshishAsync(dto.ToEntity());
    }

    public async Task<long> CreateBilaguzukAsync(BilaguzukCreateDto dto)
    {
        MahsulotValidator.Tekshir(dto);
        return await QoshishAsync(dto.ToEntity());
    }

    public async Task<long> CreateKozoynakAsync(KozoynakCreateDto dto)
    {
        MahsulotValidator.Tekshir(dto);
        return await QoshishAsync(dto.ToEntity());
    }

    public async Task UpdateSoatAsync(long mahsulotId, SoatUpdateDto dto)
    {
        MahsulotValidator.Tekshir(dto);
        ValidatorExtensions.EnumTekshir(dto.Mexanizmi, nameof(dto.Mexanizmi));

        var soat = await TopishAsync<Soatlar>(mahsulotId);
        dto.ToUpdateEntity(soat);
        await SaqlashAsync(soat);
    }

    public async Task UpdateKepkaAsync(long mahsulotId, KepkaUpdateDto dto)
    {
        MahsulotValidator.Tekshir(dto);
        ValidatorExtensions.EnumTekshir(dto.Turi, nameof(dto.Turi));

        var kepka = await TopishAsync<Kepkalar>(mahsulotId);
        dto.ToUpdateEntity(kepka);
        await SaqlashAsync(kepka);
    }

    public async Task UpdateUzukAsync(long mahsulotId, UzukUpdateDto dto)
    {
        MahsulotValidator.Tekshir(dto);

        var uzuk = await TopishAsync<Uzuklar>(mahsulotId);
        dto.ToUpdateEntity(uzuk);
        await SaqlashAsync(uzuk);
    }

    public async Task UpdateBilaguzukAsync(long mahsulotId, BilaguzukUpdateDto dto)
    {
        MahsulotValidator.Tekshir(dto);

        var bilaguzuk = await TopishAsync<Bilaguzuklar>(mahsulotId);
        dto.ToUpdateEntity(bilaguzuk);
        await SaqlashAsync(bilaguzuk);
    }

    public async Task UpdateKozoynakAsync(long mahsulotId, KozoynakUpdateDto dto)
    {
        MahsulotValidator.Tekshir(dto);

        var kozoynak = await TopishAsync<Kozoynaklar>(mahsulotId);
        dto.ToUpdateEntity(kozoynak);
        await SaqlashAsync(kozoynak);
    }

    public async Task DeleteAsync(long mahsulotId)
    {
        var mahsulot = await MahsulotRepository.GetAllQuery()
            .Include(m => m.Rasmlari)
            .FirstOrDefaultAsync(m => m.MahsulotId == mahsulotId);

        if (mahsulot == null)
        {
            throw new NotFoundException($"{mahsulotId} raqamli mahsulot topilmadi.");
        }

        // Bazadagi qatorlar cascade bilan o'chadi, fayllarni o'zimiz o'chiramiz
        RasmService.FayllarniOchirish(mahsulot.Rasmlari);

        MahsulotRepository.Delete(mahsulot);
        await MahsulotRepository.SaveChangesAsync();
    }

    private async Task<long> QoshishAsync(Mahsulot mahsulot)
    {
        await MahsulotRepository.AddAsync(mahsulot);
        await MahsulotRepository.SaveChangesAsync();

        return mahsulot.MahsulotId;
    }

    private async Task<T> TopishAsync<T>(long mahsulotId) where T : Mahsulot
    {
        var mahsulot = await MahsulotRepository.GetAllQuery()
            .OfType<T>()
            .FirstOrDefaultAsync(m => m.MahsulotId == mahsulotId);

        if (mahsulot == null)
        {
            throw new NotFoundException($"{mahsulotId} raqamli mahsulot topilmadi.");
        }

        return mahsulot;
    }

    private async Task SaqlashAsync(Mahsulot mahsulot)
    {
        MahsulotRepository.Update(mahsulot);
        await MahsulotRepository.SaveChangesAsync();
    }
}
