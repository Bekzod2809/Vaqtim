namespace WatchShop.Api.Dtos;

public class SavatGetDto
{
    public List<SavatMahsulotiGetDto> Mahsulotlar { get; set; } = new List<SavatMahsulotiGetDto>();
    public decimal JamiSumma { get; set; }
}
