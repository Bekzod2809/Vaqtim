namespace WatchShop.Api.Entities;

public class PaymentSetting
{
    public long PaymentSettingId { get; set; }
    public string CardNumber { get; set; } = string.Empty;
    public string? CardHolder { get; set; }
    public DateTime UpdatedAt { get; set; }
}
