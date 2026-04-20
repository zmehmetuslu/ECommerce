namespace ECommerceAPI.Entities;

public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Stock { get; set; }

    public string ImageUrl { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Unit { get; set; } = "Adet";
    public int LowStockThreshold { get; set; } = 5;
    public string Badge { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }

    public int CategoryId { get; set; }

    public Category? Category { get; set; }
}