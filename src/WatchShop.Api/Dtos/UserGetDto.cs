using WatchShop.Api.Enums;

namespace WatchShop.Api.Dtos;

public class UserGetDto
{
    public long UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public bool PhoneVerified { get; set; }
    public string Username { get; set; } = string.Empty;
    public Role Role { get; set; }
}
