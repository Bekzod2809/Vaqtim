namespace WatchShop.Api.Entities;

public class MahsulotRasmi
{
    public long MahsulotRasmiId { get; set; }
    public string RasmHavolasi { get; set; } = string.Empty;
    public bool AsosiyRasmmi { get; set; }
    public long MahsulotId { get; set; }
    public Mahsulot Mahsulot { get; set; } = null!;
}
