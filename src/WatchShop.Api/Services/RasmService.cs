using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Exceptions;
using WatchShop.Api.Mappings;
using WatchShop.Api.Repositories;

namespace WatchShop.Api.Services;

public class RasmService : IRasmService
{
    private static readonly string[] RuxsatEtilganKengaytmalar = [".jpg", ".jpeg", ".png", ".webp"];
    private const long EngKattaHajm = 5 * 1024 * 1024;
    private const string RasmlarPapkasi = "rasmlar";

    private readonly IBaseRepository<Mahsulot> MahsulotRepository;
    private readonly IBaseRepository<MahsulotRasmi> RasmRepository;
    private readonly IWebHostEnvironment WebHostEnvironment;

    public RasmService(
        IBaseRepository<Mahsulot> mahsulotRepository,
        IBaseRepository<MahsulotRasmi> rasmRepository,
        IWebHostEnvironment webHostEnvironment)
    {
        MahsulotRepository = mahsulotRepository;
        RasmRepository = rasmRepository;
        WebHostEnvironment = webHostEnvironment;
    }

    public async Task<MahsulotRasmiGetDto> YuklashAsync(long mahsulotId, MahsulotRasmiCreateDto dto)
    {
        var mahsulot = await MahsulotRepository.GetAllQuery()
            .Include(m => m.Rasmlari)
            .FirstOrDefaultAsync(m => m.MahsulotId == mahsulotId);

        if (mahsulot == null)
        {
            throw new NotFoundException($"{mahsulotId} raqamli mahsulot topilmadi.");
        }

        var kengaytma = Tekshirish(dto.Rasm);
        var faylNomi = await FaylniSaqlashAsync(dto.Rasm, kengaytma);

        // Birinchi rasm avtomatik asosiy bo'ladi, aks holda admin belgilaydi
        var asosiymi = dto.AsosiyRasmmi || mahsulot.Rasmlari.Count == 0;

        if (asosiymi)
        {
            foreach (var eskiRasm in mahsulot.Rasmlari)
            {
                eskiRasm.AsosiyRasmmi = false;
            }
        }

        var rasm = new MahsulotRasmi
        {
            MahsulotId = mahsulotId,
            RasmHavolasi = $"/{RasmlarPapkasi}/{faylNomi}",
            AsosiyRasmmi = asosiymi
        };

        await RasmRepository.AddAsync(rasm);
        await RasmRepository.SaveChangesAsync();

        return rasm.ToGetDto();
    }

    public async Task DeleteAsync(long mahsulotRasmiId)
    {
        var rasm = await RasmRepository.GetAllQuery()
            .FirstOrDefaultAsync(r => r.MahsulotRasmiId == mahsulotRasmiId);

        if (rasm == null)
        {
            throw new NotFoundException($"{mahsulotRasmiId} raqamli rasm topilmadi.");
        }

        FayllarniOchirish([rasm]);

        RasmRepository.Delete(rasm);
        await RasmRepository.SaveChangesAsync();
    }

    public void FayllarniOchirish(IEnumerable<MahsulotRasmi> rasmlar)
    {
        foreach (var rasm in rasmlar)
        {
            var faylYoli = Path.Combine(WebHostEnvironment.WebRootPath, RasmlarPapkasi, Path.GetFileName(rasm.RasmHavolasi));

            if (File.Exists(faylYoli))
            {
                File.Delete(faylYoli);
            }
        }
    }

    private static string Tekshirish(IFormFile rasm)
    {
        if (rasm == null || rasm.Length == 0)
        {
            throw new BadRequestException("Rasm fayli tanlanmagan.");
        }

        if (rasm.Length > EngKattaHajm)
        {
            throw new BadRequestException("Rasm hajmi 5 MB dan oshmasligi kerak.");
        }

        var kengaytma = Path.GetExtension(rasm.FileName).ToLowerInvariant();

        if (!RuxsatEtilganKengaytmalar.Contains(kengaytma))
        {
            throw new BadRequestException("Faqat jpg, jpeg, png va webp rasmlar qabul qilinadi.");
        }

        return kengaytma;
    }

    private async Task<string> FaylniSaqlashAsync(IFormFile rasm, string kengaytma)
    {
        var papka = Path.Combine(WebHostEnvironment.WebRootPath, RasmlarPapkasi);
        Directory.CreateDirectory(papka);

        // Har bir faylga takrorlanmas nom: ikki admin bir xil nomli rasm yuklasa bir-birini o'chirmasin
        var faylNomi = $"{Guid.NewGuid()}{kengaytma}";

        using var stream = new FileStream(Path.Combine(papka, faylNomi), FileMode.Create);
        await rasm.CopyToAsync(stream);

        return faylNomi;
    }
}
