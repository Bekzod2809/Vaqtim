namespace WatchShop.Api.Entities;

public class PhoneVerification
{
    public long PhoneVerificationId { get; set; }
    public long TelegramUserId { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string CodeHash { get; set; } = string.Empty;
    public int FailedAttempts { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsConsumed { get; set; }
}
