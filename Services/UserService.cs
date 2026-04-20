using ECommerceAPI.Entities;
using ECommerceAPI.Repositories;

namespace ECommerceAPI.Services;

public class UserService
{
    private readonly UserRepository _userRepository;
    private readonly TokenService _tokenService; // 👈 EKLEDİK

    public UserService(UserRepository userRepository, TokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    // REGISTER
    public bool Register(User user)
    {
        var existingUser = _userRepository.GetUserByUsername(user.Username);

        if (existingUser != null)
        {
            return false;
        }

        user.Role = "User";
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

        _userRepository.AddUser(user);
        return true;
    }

    // LOGIN
    public string? Login(string username, string password)
    {
        var user = _userRepository.GetUserByUsername(username);

        if (user == null)
        {
            return null;
        }

        var isLegacyPlainTextPassword = user.Password == password;
        var isValidPassword = false;

        // Eski plain-text kayıtlar varken Verify çağrısı format hatası fırlatabilir.
        // Bu nedenle hash doğrulamayı güvenli şekilde try/catch içinde yapıyoruz.
        try
        {
            isValidPassword = BCrypt.Net.BCrypt.Verify(password, user.Password);
        }
        catch
        {
            isValidPassword = false;
        }

        if (!isValidPassword && !isLegacyPlainTextPassword)
        {
            return null;
        }

        // Geçmişte plain-text kaydedilmiş kullanıcıları güvenli hale getir.
        if (isLegacyPlainTextPassword)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(password);
            _userRepository.UpdateUser(user);
        }

        return _tokenService.CreateToken(user);
    }
}






/*
BU DOSYANIN AÇIKLAMASI:

Bu service, kullanıcı kayıt ve giriş işlemlerinin iş mantığını içerir.
Kullanıcı kontrolü yapılır ve başarılı girişte JWT token oluşturulur.

ÇALIŞMA MANTIĞI:
- Controller bu service'i çağırır
- Kullanıcı bilgileri repository üzerinden kontrol edilir
- Giriş başarılıysa TokenService ile token üretilir

YAPILAN İŞLEMLER:

Register:
- Kullanıcı adı veritabanında var mı kontrol edilir
- Eğer varsa kayıt yapılmaz
- Eğer yoksa kullanıcı oluşturulur
- Varsayılan olarak Role = "User" atanır

Login:
- Kullanıcı adı ile kullanıcı bulunur
- Şifre kontrol edilir
- Eğer doğruysa TokenService ile JWT token oluşturulur
- Token frontend'e gönderilir

BAĞLANTILI DOSYALAR:
- AuthController.cs → bu service'i çağırır
- UserRepository.cs → kullanıcı veritabanı işlemleri
- TokenService.cs → token üretimi burada yapılır
- Login.jsx → frontend login işlemi

NOT:
Login işleminin en önemli kısmı token üretimidir.
Kullanıcı doğrulandıktan sonra sistem JWT ile çalışmaya devam eder.
*/