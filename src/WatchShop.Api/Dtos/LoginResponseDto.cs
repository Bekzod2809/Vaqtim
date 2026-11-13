namespace WatchShop.Api.Dtos;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserGetDto User { get; set; } = null!;
}
