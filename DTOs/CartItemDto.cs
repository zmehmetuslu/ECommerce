namespace ECommerceAPI.DTOs;

public class CartItemDto
{
    public int ProductId { get; set; } // ürünün id'si
    public string ProductName { get; set; } = string.Empty; // ürün adı
    public string ProductImageUrl { get; set; } = string.Empty; // ürün görsel dosya adı
    public int Quantity { get; set; } // kaç tane var
    public decimal Price { get; set; } // tek ürün fiyatı
    public decimal LineTotal { get; set; } // bu satırın toplamı = fiyat x adet
}