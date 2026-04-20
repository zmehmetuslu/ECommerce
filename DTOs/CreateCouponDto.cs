namespace ECommerceAPI.DTOs;

public class CreateCouponDto
{
    public string Code { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public decimal MinTotal { get; set; }
    public int? UsageLimit { get; set; }
    public int PerUserLimit { get; set; } = 1;
    public DateTime? ExpireAt { get; set; }
}
