using System.ComponentModel.DataAnnotations;

namespace ECommerceAPI.DTOs;

public class UpdateProductDto
{
    [Required(ErrorMessage = "Product name is required.")]
    [StringLength(150, ErrorMessage = "Product name can be at most 150 characters.")]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative.")]
    public int Stock { get; set; }

    [Required(ErrorMessage = "Image URL is required.")]
    public string ImageUrl { get; set; } = string.Empty;

    public string ShortDescription { get; set; } = string.Empty;

    [Required(ErrorMessage = "Unit is required.")]
    public string Unit { get; set; } = "Adet";

    [Range(0, int.MaxValue, ErrorMessage = "Low stock threshold cannot be negative.")]
    public int LowStockThreshold { get; set; } = 5;

    public string Badge { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "CategoryId must be greater than 0.")]
    public int CategoryId { get; set; }
}