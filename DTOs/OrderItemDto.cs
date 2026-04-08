namespace ECommerceAPI.DTOs;

public class OrderItemDto
{
    public int ProductId { get; set; } // hangi ürün
    public string ProductName { get; set; } = string.Empty; // ürün adı
    public int Quantity { get; set; } // kaç tane
    public decimal Price { get; set; } // sipariş anındaki birim fiyat
    public decimal LineTotal { get; set; } // satır toplamı
}