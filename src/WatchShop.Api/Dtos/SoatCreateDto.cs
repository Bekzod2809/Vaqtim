using WatchShop.Api.Enums;

namespace WatchShop.Api.Dtos;

public class SoatCreateDto : IMahsulotYozishDto
{
    public string Nomi { get; set; } = string.Empty;
    public string? Tavsifi { get; set; }
    public string Brendi { get; set; } = string.Empty;
    public string Rangi { get; set; } = string.Empty;
    public decimal Narxi { get; set; }
    public decimal? ChegirmaNarxi { get; set; }
    public int OmbordagiSoni { get; set; }
    public MexanizmTuri Mexanizmi { get; set; }
}
