using WatchShop.Api.Enums;

namespace WatchShop.Api.Entities;

public class Foydalanuvchi
{
    public long FoydalanuvchiId { get; set; }
    public string Ism { get; set; } = string.Empty;
    public string Familiya { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string ParolHash { get; set; } = string.Empty;
    public Rol Rol { get; set; } = Rol.User;
}
