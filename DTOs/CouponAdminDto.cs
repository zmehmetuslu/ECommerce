namespace ECommerceAPI.DTOs;

public class CouponAdminDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public decimal MinTotal { get; set; }
    public bool IsActive { get; set; }
    public DateTime? ExpireAt { get; set; }
    public int? UsageLimit { get; set; }
    public int UsedCount { get; set; }
    public int PerUserLimit { get; set; }
}
