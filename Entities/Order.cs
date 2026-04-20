namespace ECommerceAPI.Entities;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal TotalPrice { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.Now;

    public string Status { get; set; } = "Pending";
    public string PaymentStatus { get; set; } = "Pending";
    public string PaymentMethod { get; set; } = "Kapida Odeme";
    public string? PaymentReference { get; set; }
    public DateTime? PaymentUpdatedAt { get; set; }

    public List<OrderItem> Items { get; set; } = new();
}