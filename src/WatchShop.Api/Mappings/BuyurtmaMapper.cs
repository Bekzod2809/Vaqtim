using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Mappings;

public static class BuyurtmaMapper
{
    public static BuyurtmaGetDto ToGetDto(this Buyurtma buyurtma)
    {
        return new BuyurtmaGetDto
        {
            BuyurtmaId = buyurtma.BuyurtmaId,
            FoydalanuvchiId = buyurtma.FoydalanuvchiId,
            YetkazishManzili = buyurtma.YetkazishManzili,
            Telefon = buyurtma.Telefon,
            JamiSumma = buyurtma.JamiSumma,
            Holati = buyurtma.Holati,
            YaratilganVaqt = buyurtma.YaratilganVaqt,
            Mahsulotlari = buyurtma.Mahsulotlari.Select(bm => new BuyurtmaMahsulotiGetDto
            {
                MahsulotId = bm.MahsulotId,
                MahsulotNomi = bm.MahsulotNomi,
                Narxi = bm.Narxi,
                Soni = bm.Soni,
                Summa = bm.Narxi * bm.Soni
            }).ToList()
        };
    }
}
