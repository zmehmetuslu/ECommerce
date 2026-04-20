namespace ECommerceAPI.DTOs;

public class WishlistItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime AddedAt { get; set; }
}
