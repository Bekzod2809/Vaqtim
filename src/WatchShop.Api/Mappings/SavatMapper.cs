using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Mappings;

public static class SavatMapper
{
    public static SavatMahsulotiGetDto ToGetDto(this SavatMahsuloti qator)
    {
        var asosiyRasm = qator.Mahsulot.Rasmlari.FirstOrDefault(r => r.AsosiyRasmmi)
            ?? qator.Mahsulot.Rasmlari.FirstOrDefault();

        return new SavatMahsulotiGetDto
        {
            SavatMahsulotiId = qator.SavatMahsulotiId,
            MahsulotId = qator.MahsulotId,
            Nomi = qator.Mahsulot.Nomi,
            Narxi = qator.Mahsulot.AmaldagiNarx,
            Soni = qator.Soni,
            Summa = qator.Mahsulot.AmaldagiNarx * qator.Soni,
            OmbordaYetarli = qator.Soni <= qator.Mahsulot.OmbordagiSoni,
            AsosiyRasmHavolasi = asosiyRasm?.RasmHavolasi
        };
    }

    public static SavatGetDto ToSavatDto(this List<SavatMahsuloti> qatorlar)
    {
        var mahsulotlar = qatorlar.Select(q => q.ToGetDto()).ToList();

        return new SavatGetDto
        {
            Mahsulotlar = mahsulotlar,
            JamiSumma = mahsulotlar.Sum(m => m.Summa)
        };
    }
}
