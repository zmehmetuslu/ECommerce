public class CreateProductDto
{
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string ImageUrl { get; set; } = "budama1.jpg"; // Eğer Frontend boş gönderirse bunu yaz
    public string ShortDescription { get; set; } = "";
    public string Unit { get; set; } = "Adet";
    public int LowStockThreshold { get; set; } = 5;
    public string Badge { get; set; } = "";
    public bool IsFeatured { get; set; }
    public int CategoryId { get; set; }
}