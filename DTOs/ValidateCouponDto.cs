namespace ECommerceAPI.DTOs;

public class ValidateCouponDto
{
    public string Code { get; set; } = string.Empty;
    public decimal SubTotal { get; set; }
    public decimal ShippingFee { get; set; }
    public string? Username { get; set; }
}
