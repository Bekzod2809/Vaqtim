using WatchShop.Api.Enums;

namespace WatchShop.Api.Entities;

public class Buyurtma
{
    public long BuyurtmaId { get; set; }
    public string YetkazishManzili { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public decimal JamiSumma { get; set; }
    public BuyurtmaHolati Holati { get; set; } = BuyurtmaHolati.Yangi;
    public DateTime YaratilganVaqt { get; set; }
    public long FoydalanuvchiId { get; set; }
    public Foydalanuvchi Foydalanuvchi { get; set; } = null!;
    public ICollection<BuyurtmaMahsuloti> Mahsulotlari { get; set; } = new List<BuyurtmaMahsuloti>();
}
