namespace ECommerceAPI.DTOs;

public class OrderDto
{
    public int OrderId { get; set; } // sipariş numarası
    public string Status { get; set; } = string.Empty; // sipariş durumu
    public string PaymentStatus { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentReference { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty; // siparişi veren kullanıcı
    public DateTime OrderDate { get; set; } // sipariş tarihi
    public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>(); // sipariş içeriği
    public decimal TotalPrice { get; set; } // sipariş toplamı
}