namespace WatchShop.Api.Services;

public interface IPhoneVerificationService
{
    Task<string?> CreateCodeAsync(long telegramUserId, string phone);
    Task VerifyAndConsumeAsync(string phone, string code);
}
