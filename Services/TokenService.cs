using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ECommerceAPI.Entities;
using Microsoft.Extensions.Options;
namespace ECommerceAPI.Services;

public class TokenService
{
    private readonly JwtSettings _jwtSettings;

    public TokenService(IOptions<JwtSettings> jwtOptions)
    {
        _jwtSettings = jwtOptions.Value;
    }

    public string CreateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_jwtSettings.ExpirationHours),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}







/*
BU DOSYANIN AÇIKLAMASI:

Bu service, kullanıcı giriş yaptıktan sonra JWT (JSON Web Token) üretir.
Bu token sayesinde kullanıcı kimliği doğrulanır ve yetkili işlemler yapılabilir.

ÇALIŞMA MANTIĞI:
- Kullanıcı login olduktan sonra bu service çağrılır
- Kullanıcı bilgileri (username ve role) token içine eklenir
- Gizli anahtar ile token imzalanır
- Token string olarak frontend'e gönderilir

YAPILAN İŞLEMLER:

CreateToken:
- Kullanıcının username ve role bilgileri claim olarak eklenir
- Secret key ile güvenli imzalama yapılır
- Token oluşturulur ve süresi belirlenir (1 saat)
- Token string olarak döndürülür

BAĞLANTILI DOSYALAR:
- UserService.cs → login sırasında bu service çağrılır
- AuthController.cs → token frontend'e buradan gönderilir
- Program.cs → JWT doğrulama ayarları burada yapılır
- api.js → frontend her istekte bu token'ı gönderir

NOT:
Token içinde kullanıcı adı ve rol bilgisi taşınır.
Bu sayede sistem kullanıcının kim olduğunu ve yetkisini anlayabilir.
*/