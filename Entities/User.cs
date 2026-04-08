namespace ECommerceAPI.Entities;

public class User
{
    public int Id { get; set; } // kullanıcının benzersiz numarası
    public string Username { get; set; } = string.Empty; // kullanıcı adı
    public string Password { get; set; } = string.Empty; // şifre

     public string Role { get; set; } = "User";
}