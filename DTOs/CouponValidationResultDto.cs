namespace ECommerceAPI.DTOs;

public class CouponValidationResultDto
{
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; }
    public decimal ShippingDiscount { get; set; }
}
