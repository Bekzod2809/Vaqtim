namespace WatchShop.Api.Dtos;

public class BuyurtmaMahsulotiGetDto
{
    public long? MahsulotId { get; set; }
    public string MahsulotNomi { get; set; } = string.Empty;
    public decimal Narxi { get; set; }
    public int Soni { get; set; }
    public decimal Summa { get; set; }
}
