namespace ECommerceAPI.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public int LowStockThreshold { get; set; }
    public string Badge { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public int CategoryId { get; set; }
}