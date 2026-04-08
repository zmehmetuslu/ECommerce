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

    // 🔥 sadece role ekle
    user.Role = "User";

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

        if (user.Password != password)
        {
            return null;
        }

        // 👇 TOKEN OLUŞTURUYORUZ (en önemli kısım)
        return _tokenService.CreateToken(user);
    }
}