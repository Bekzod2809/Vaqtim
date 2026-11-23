namespace WatchShop.Api.Dtos;

public class PaymentSettingDto
{
    public string CardNumber { get; set; } = string.Empty;
    public string? CardHolder { get; set; }
}
