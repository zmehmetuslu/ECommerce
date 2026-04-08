using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ECommerceAPI.Entities;
namespace ECommerceAPI.Services;

public class TokenService
{
    private readonly string _secretKey = "this_is_my_super_secret_key_12345";

   public string CreateToken(User user)
    {
        // Token içinde hangi bilgileri taşıyacağımızı belirliyoruz
      

var claims = new[]
{
    new Claim(ClaimTypes.Name, user.Username),
    new Claim(ClaimTypes.Role, user.Role)
};

        // Gizli anahtarı byte dizisine çeviriyoruz
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));

        // İmzalama bilgisi oluşturuyoruz
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Token'ı oluşturuyoruz
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );

        // Token'ı string haline çevirip geri döndürüyoruz
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}