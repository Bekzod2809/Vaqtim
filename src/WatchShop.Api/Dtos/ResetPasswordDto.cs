namespace WatchShop.Api.Dtos;

public class ResetPasswordDto
{
    public string Phone { get; set; } = string.Empty;
    public string VerificationCode { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
