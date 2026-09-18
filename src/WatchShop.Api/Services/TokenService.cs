using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WatchShop.Api.Configurations.Settings;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Services;

public class TokenService : ITokenService
{
    private readonly JwtSettings JwtSettings;

    public TokenService(JwtSettings jwtSettings)
    {
        JwtSettings = jwtSettings;
    }

    public string GetToken(Foydalanuvchi foydalanuvchi)
    {
        var claims = new Claim[]
        {
            new Claim("FoydalanuvchiId", foydalanuvchi.FoydalanuvchiId.ToString()),
            new Claim("Username", foydalanuvchi.Username),
            new Claim(ClaimTypes.Email, foydalanuvchi.Email),
            new Claim(ClaimTypes.Role, foydalanuvchi.Rol.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSettings.SecurityKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: JwtSettings.Issuer,
            audience: JwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(JwtSettings.Lifetime),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
