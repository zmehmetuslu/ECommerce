namespace ECommerceAPI.Entities;

public class Cart
{
    public int Id { get; set; }

    public int UserId { get; set; } // bu sepet kime ait
    public User? User { get; set; }

    public List<CartItem> Items { get; set; } = new List<CartItem>(); // sepetteki ürünler
}