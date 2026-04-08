namespace ECommerceAPI.DTOs;

public class CartDto
{
    public List<CartItemDto> Items { get; set; } = new List<CartItemDto>(); // sepetteki ürünler
    public decimal TotalPrice { get; set; } // tüm sepetin toplam fiyatı
}