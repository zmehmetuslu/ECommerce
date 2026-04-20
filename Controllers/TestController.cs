using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet("public")]
    public IActionResult PublicEndpoint()
    {
        return Ok("This endpoint is public.");
    }

    [Authorize]
    [HttpGet("private")]
    public IActionResult PrivateEndpoint()
    {
        return Ok("You are authenticated. Token is valid.");
    }
}























/*
BU DOSYANIN AÇIKLAMASI:

Bu controller, JWT authentication sistemini test etmek için oluşturulmuştur.
Public ve private endpoint farkını göstermek amacıyla kullanılır.

ÇALIŞMA MANTIĞI:
- public endpoint → herkes erişebilir (giriş yapmadan)
- private endpoint → sadece giriş yapan kullanıcı erişebilir (token gerekir)

YAPILAN İŞLEMLER:
- PublicEndpoint → herhangi bir kullanıcı erişebilir
- PrivateEndpoint → [Authorize] olduğu için sadece token ile erişilebilir

BAĞLANTILI KISIMLAR:
- Program.cs → JWT doğrulama ayarları burada yapılır
- TokenService.cs → token üretimi
- AuthController.cs → login sonrası token alınır

NOT:
Bu controller gerçek bir iş mantığı içermez.
Sadece authentication sisteminin doğru çalışıp çalışmadığını test etmek için kullanılır.
*/