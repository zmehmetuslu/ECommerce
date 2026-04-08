namespace ECommerceAPI.DTOs;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty; // kullanıcıya dönecek JWT
}