using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Mappings;

public static class MahsulotMapper
{
    public static MahsulotKartaDto ToKartaDto(this Mahsulot mahsulot)
    {
        var asosiyRasm = mahsulot.Rasmlari.FirstOrDefault(r => r.AsosiyRasmmi)
            ?? mahsulot.Rasmlari.FirstOrDefault();

        return new MahsulotKartaDto
        {
            MahsulotId = mahsulot.MahsulotId,
            Nomi = mahsulot.Nomi,
            Brendi = mahsulot.Brendi,
            Rangi = mahsulot.Rangi,
            Narxi = mahsulot.Narxi,
            ChegirmaNarxi = mahsulot.ChegirmaNarxi,
            OmbordagiSoni = mahsulot.OmbordagiSoni,
            Kategoriya = mahsulot.Kategoriya,
            AsosiyRasmHavolasi = asosiyRasm?.RasmHavolasi
        };
    }

    public static MahsulotBatafsilDto ToBatafsilDto(this Mahsulot mahsulot)
    {
        var dto = new MahsulotBatafsilDto
        {
            MahsulotId = mahsulot.MahsulotId,
            Nomi = mahsulot.Nomi,
            Tavsifi = mahsulot.Tavsifi,
            Brendi = mahsulot.Brendi,
            Rangi = mahsulot.Rangi,
            Narxi = mahsulot.Narxi,
            ChegirmaNarxi = mahsulot.ChegirmaNarxi,
            OmbordagiSoni = mahsulot.OmbordagiSoni,
            Kategoriya = mahsulot.Kategoriya,
            Rasmlari = mahsulot.Rasmlari.Select(r => r.ToGetDto()).ToList()
        };

        if (mahsulot is Soatlar soat)
        {
            dto.Mexanizmi = soat.Mexanizmi;
        }

        if (mahsulot is Kepkalar kepka)
        {
            dto.KepkaTuri = kepka.Turi;
        }

        return dto;
    }

    public static Soatlar ToEntity(this SoatCreateDto dto)
    {
        var soat = new Soatlar { Mexanizmi = dto.Mexanizmi };
        UmumiyMaydonlarniYozish(dto, soat);
        return soat;
    }

    public static Kepkalar ToEntity(this KepkaCreateDto dto)
    {
        var kepka = new Kepkalar { Turi = dto.Turi };
        UmumiyMaydonlarniYozish(dto, kepka);
        return kepka;
    }

    public static Uzuklar ToEntity(this UzukCreateDto dto)
    {
        var uzuk = new Uzuklar();
        UmumiyMaydonlarniYozish(dto, uzuk);
        return uzuk;
    }

    public static Bilaguzuklar ToEntity(this BilaguzukCreateDto dto)
    {
        var bilaguzuk = new Bilaguzuklar();
        UmumiyMaydonlarniYozish(dto, bilaguzuk);
        return bilaguzuk;
    }

    public static Kozoynaklar ToEntity(this KozoynakCreateDto dto)
    {
        var kozoynak = new Kozoynaklar();
        UmumiyMaydonlarniYozish(dto, kozoynak);
        return kozoynak;
    }

    public static void ToUpdateEntity(this SoatUpdateDto dto, Soatlar soat)
    {
        UmumiyMaydonlarniYozish(dto, soat);
        soat.Mexanizmi = dto.Mexanizmi;
    }

    public static void ToUpdateEntity(this KepkaUpdateDto dto, Kepkalar kepka)
    {
        UmumiyMaydonlarniYozish(dto, kepka);
        kepka.Turi = dto.Turi;
    }

    public static void ToUpdateEntity(this UzukUpdateDto dto, Uzuklar uzuk)
    {
        UmumiyMaydonlarniYozish(dto, uzuk);
    }

    public static void ToUpdateEntity(this BilaguzukUpdateDto dto, Bilaguzuklar bilaguzuk)
    {
        UmumiyMaydonlarniYozish(dto, bilaguzuk);
    }

    public static void ToUpdateEntity(this KozoynakUpdateDto dto, Kozoynaklar kozoynak)
    {
        UmumiyMaydonlarniYozish(dto, kozoynak);
    }

    // Barcha mahsulot DTO'lari IMahsulotYozishDto dan keladi, shuning uchun umumiy maydonlar bir joyda yoziladi
    private static void UmumiyMaydonlarniYozish(IMahsulotYozishDto dto, Mahsulot mahsulot)
    {
        mahsulot.Nomi = dto.Nomi;
        mahsulot.Tavsifi = dto.Tavsifi;
        mahsulot.Brendi = dto.Brendi;
        mahsulot.Rangi = dto.Rangi;
        mahsulot.Narxi = dto.Narxi;
        mahsulot.ChegirmaNarxi = dto.ChegirmaNarxi;
        mahsulot.OmbordagiSoni = dto.OmbordagiSoni;
    }
}
