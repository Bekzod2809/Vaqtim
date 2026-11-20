using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Configurations.Settings;
using WatchShop.Api.Entities;
using WatchShop.Api.Exceptions;
using WatchShop.Api.Repositories;

namespace WatchShop.Api.Services;

public class PhoneVerificationService : IPhoneVerificationService
{
    private static readonly TimeSpan CodeLifetime = TimeSpan.FromMinutes(5);
    private static readonly TimeSpan ResendDelay = TimeSpan.FromSeconds(60);
    private const int MaxFailedAttempts = 5;

    private readonly IBaseRepository<PhoneVerification> VerificationRepository;
    private readonly JwtSettings JwtSettings;

    public PhoneVerificationService(
        IBaseRepository<PhoneVerification> verificationRepository,
        JwtSettings jwtSettings)
    {
        VerificationRepository = verificationRepository;
        JwtSettings = jwtSettings;
    }

    public async Task<string?> CreateCodeAsync(long telegramUserId, string phone)
    {
        var normalizedPhone = NormalizePhone(phone);
        var now = DateTime.UtcNow;

        var recent = await VerificationRepository.GetAllQuery()
            .Where(x => x.TelegramUserId == telegramUserId && !x.IsConsumed && x.ExpiresAt > now)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        if (recent != null && recent.CreatedAt.Add(ResendDelay) > now)
        {
            return null;
        }

        var stale = await VerificationRepository.GetAllQuery()
            .Where(x => x.ExpiresAt <= now.AddDays(-1))
            .ToListAsync();
        foreach (var item in stale)
        {
            VerificationRepository.Delete(item);
        }

        var activeForTelegramUser = await VerificationRepository.GetAllQuery()
            .Where(x => x.TelegramUserId == telegramUserId && !x.IsConsumed)
            .ToListAsync();
        foreach (var item in activeForTelegramUser)
        {
            item.IsConsumed = true;
            VerificationRepository.Update(item);
        }

        var code = RandomNumberGenerator.GetInt32(100000, 1000000)
            .ToString(CultureInfo.InvariantCulture);

        await VerificationRepository.AddAsync(new PhoneVerification
        {
            TelegramUserId = telegramUserId,
            Phone = normalizedPhone,
            CodeHash = HashCode(normalizedPhone, code),
            CreatedAt = now,
            ExpiresAt = now.Add(CodeLifetime)
        });
        await VerificationRepository.SaveChangesAsync();
        return code;
    }

    public async Task VerifyAndConsumeAsync(string phone, string code)
    {
        var normalizedPhone = NormalizePhone(phone);
        if (!Regex.IsMatch(code ?? string.Empty, @"^\d{6}$"))
        {
            throw new BadRequestException("Telegram botdan olingan 6 xonali kodni kiriting.");
        }

        var now = DateTime.UtcNow;
        var verification = await VerificationRepository.GetAllQuery()
            .Where(x => x.Phone == normalizedPhone && !x.IsConsumed && x.ExpiresAt > now)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        if (verification == null || verification.FailedAttempts >= MaxFailedAttempts)
        {
            throw new BadRequestException("Tasdiqlash kodi topilmadi yoki muddati tugagan. Telegram botdan yangi kod oling.");
        }

        var expectedHash = Convert.FromHexString(verification.CodeHash);
        var actualHash = Convert.FromHexString(HashCode(normalizedPhone, code!));
        if (!CryptographicOperations.FixedTimeEquals(expectedHash, actualHash))
        {
            verification.FailedAttempts++;
            if (verification.FailedAttempts >= MaxFailedAttempts)
            {
                verification.IsConsumed = true;
            }

            VerificationRepository.Update(verification);
            await VerificationRepository.SaveChangesAsync();
            throw new BadRequestException("Tasdiqlash kodi noto'g'ri.");
        }

        verification.IsConsumed = true;
        VerificationRepository.Update(verification);
        // Chaqiruvchi userni saqlaganda shu DbContext ichidagi ishlatilgan kod ham birga saqlanadi.
    }

    private static string NormalizePhone(string phone)
    {
        var normalized = (phone ?? string.Empty).Trim();
        if (!Regex.IsMatch(normalized, @"^\+998\d{9}$"))
        {
            throw new BadRequestException("Telefon raqami +998901234567 formatida bo'lishi kerak.");
        }

        return normalized;
    }

    private string HashCode(string phone, string code)
    {
        var key = Encoding.UTF8.GetBytes(JwtSettings.SecurityKey);
        var message = Encoding.UTF8.GetBytes($"{phone}:{code}");
        return Convert.ToHexString(HMACSHA256.HashData(key, message));
    }
}
