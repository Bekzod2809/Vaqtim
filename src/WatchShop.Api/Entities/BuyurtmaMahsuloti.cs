namespace WatchShop.Api.Entities;

public class BuyurtmaMahsuloti
{
    public long BuyurtmaMahsulotiId { get; set; }

    // Buyurtma paytidagi nom va narx nusxasi: mahsulot keyin o'zgarsa yoki o'chsa ham buyurtma tarixi saqlanadi
    public string MahsulotNomi { get; set; } = string.Empty;
    public decimal Narxi { get; set; }
    public int Soni { get; set; }

    public long BuyurtmaId { get; set; }
    public Buyurtma Buyurtma { get; set; } = null!;
    public long? MahsulotId { get; set; }
    public Mahsulot? Mahsulot { get; set; }
}
