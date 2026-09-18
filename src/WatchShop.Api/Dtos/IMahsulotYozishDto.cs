namespace WatchShop.Api.Dtos;

// Mahsulot qo'shish va yangilash DTO'lari uchun umumiy maydonlar.
// Shu interfeys tufayli hamma mahsulotga bitta validator yetadi.
public interface IMahsulotYozishDto
{
    string Nomi { get; set; }
    string? Tavsifi { get; set; }
    string Brendi { get; set; }
    string Rangi { get; set; }
    decimal Narxi { get; set; }
    decimal? ChegirmaNarxi { get; set; }
    int OmbordagiSoni { get; set; }
}
