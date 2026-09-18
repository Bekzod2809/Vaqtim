namespace WatchShop.Api.Entities;

public class SavatMahsuloti
{
    public long SavatMahsulotiId { get; set; }
    public int Soni { get; set; }
    public long FoydalanuvchiId { get; set; }
    public Foydalanuvchi Foydalanuvchi { get; set; } = null!;
    public long MahsulotId { get; set; }
    public Mahsulot Mahsulot { get; set; } = null!;
}
