using WatchShop.Api.Enums;

namespace WatchShop.Api.Dtos;

public class MahsulotBatafsilDto
{
    public long MahsulotId { get; set; }
    public string Nomi { get; set; } = string.Empty;
    public string? Tavsifi { get; set; }
    public string Brendi { get; set; } = string.Empty;
    public string Rangi { get; set; } = string.Empty;
    public decimal Narxi { get; set; }
    public decimal? ChegirmaNarxi { get; set; }
    public int OmbordagiSoni { get; set; }
    public Kategoriya Kategoriya { get; set; }
    public MexanizmTuri? Mexanizmi { get; set; }
    public KepkaTuri? KepkaTuri { get; set; }
    public List<MahsulotRasmiGetDto> Rasmlari { get; set; } = new List<MahsulotRasmiGetDto>();
}
