namespace ECommerceAPI.DTOs;

public class CreateOrderRequestDto
{
    public string? CouponCode { get; set; }
    public string? PaymentMethod { get; set; }
    public string? MockPaymentOutcome { get; set; }
}
