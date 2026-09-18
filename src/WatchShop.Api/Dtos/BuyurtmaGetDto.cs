using WatchShop.Api.Enums;

namespace WatchShop.Api.Dtos;

public class BuyurtmaGetDto
{
    public long BuyurtmaId { get; set; }
    public long FoydalanuvchiId { get; set; }
    public string YetkazishManzili { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public decimal JamiSumma { get; set; }
    public BuyurtmaHolati Holati { get; set; }
    public DateTime YaratilganVaqt { get; set; }
    public List<BuyurtmaMahsulotiGetDto> Mahsulotlari { get; set; } = new List<BuyurtmaMahsulotiGetDto>();
}
