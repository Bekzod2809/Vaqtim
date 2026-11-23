using System.Text.RegularExpressions;

namespace WatchShop.Api.Configurations.Settings;

public class AdminSettings
{
    public string Phone { get; set; } = string.Empty;

    public string NormalizedPhone => NormalizePhone(Phone);

    public bool IsAdminPhone(string? phone)
    {
        var configured = NormalizedPhone;
        if (string.IsNullOrEmpty(configured))
        {
            return false;
        }

        return string.Equals(configured, NormalizePhone(phone), StringComparison.Ordinal);
    }

    private static string NormalizePhone(string? phone)
    {
        var cleaned = (phone ?? string.Empty).Trim().Trim('"', '\'').Trim();
        cleaned = Regex.Replace(cleaned, @"[\s\-\(\)]+", string.Empty);
        if (Regex.IsMatch(cleaned, @"^998\d{9}$"))
        {
            cleaned = "+" + cleaned;
        }

        return Regex.IsMatch(cleaned, @"^\+998\d{9}$") ? cleaned : string.Empty;
    }
}
