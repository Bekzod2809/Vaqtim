namespace WatchShop.Api.Dtos;

public class SavatMahsulotiGetDto
{
    public long SavatMahsulotiId { get; set; }
    public long MahsulotId { get; set; }
    public string Nomi { get; set; } = string.Empty;
    public decimal Narxi { get; set; }
    public int Soni { get; set; }
    public decimal Summa { get; set; }
    public bool OmbordaYetarli { get; set; }
    public string? AsosiyRasmHavolasi { get; set; }
}
