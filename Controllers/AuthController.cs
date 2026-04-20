using Microsoft.AspNetCore.Mvc;
using ECommerceAPI.DTOs;
using ECommerceAPI.Entities;
using ECommerceAPI.Services;

namespace ECommerceAPI.Controllers;

[ApiController]// Bu controller API üzerinden gelen auth (giriş/kayıt) isteklerini karşılar
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;

    public AuthController(UserService userService)
    {
        _userService = userService;
    }

    // REGISTER
    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        var user = new User
        {
            Username = dto.Username,
            Password = dto.Password
        };

        var isRegistered = _userService.Register(user);

        if (!isRegistered)
        {
            return BadRequest(
                ApiResponse<object>.Fail("Username already exists.")
            );
        }

        return Ok(
            ApiResponse<object>.Ok(null, "User registered successfully.")
        );
    }

    // LOGIN
    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        // 👇 ARTIK TOKEN GELİYOR
        var token = _userService.Login(dto.Username, dto.Password);

        if (token == null)
        {
            return Unauthorized(
                ApiResponse<object>.Fail("Invalid username or password.")
            );
        }

        return Ok(
            ApiResponse<LoginResponseDto>.Ok(
                new LoginResponseDto { Token = token },
                "Login successful."
            )
        );
    }
}






















/*
BU DOSYANIN AÇIKLAMASI:

Bu controller, kullanıcıların sisteme kayıt olmasını ve giriş yapmasını sağlar.
Frontend tarafı bu dosyaya "/api/Auth" endpointi üzerinden istek gönderir.

REGISTER (KAYIT):
- Kullanıcıdan username ve password alınır.
- Bu bilgilerle yeni bir User nesnesi oluşturulur.
- UserService üzerinden kayıt işlemi yapılır.
- Eğer aynı kullanıcı adı varsa hata döner.
- Eğer yoksa kullanıcı veritabanına eklenir.

LOGIN (GİRİŞ):
- Kullanıcıdan username ve password alınır.
- UserService üzerinden kontrol edilir.
- Eğer bilgiler doğruysa TokenService ile JWT token üretilir.
- Bu token frontend'e gönderilir.
- Eğer bilgiler yanlışsa Unauthorized (401) hatası döner.

BAĞLANTILI DOSYALAR:
- UserService.cs → login ve register mantığı burada çalışır
- TokenService.cs → JWT token burada üretilir
- UserRepository.cs → kullanıcı veritabanından burada çekilir
- Login.jsx → frontend bu endpointleri çağırır

NE ZAMAN ÇALIŞIR:
- Kullanıcı kayıt olunca
- Kullanıcı giriş yapınca

NOT:
- Şifreler şu an düz (plain text) tutulmaktadır.
- Gerçek projelerde şifreler hashlenerek saklanmalıdır.
*/