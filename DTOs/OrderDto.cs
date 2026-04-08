namespace ECommerceAPI.DTOs;

public class OrderDto
{
    public int OrderId { get; set; } // sipariş numarası
    public DateTime OrderDate { get; set; } // sipariş tarihi
    public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>(); // sipariş içeriği
    public decimal TotalPrice { get; set; } // sipariş toplamı
}