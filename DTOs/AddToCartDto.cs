using System.ComponentModel.DataAnnotations;

namespace ECommerceAPI.DTOs;

public class AddToCartDto
{
    [Range(1, int.MaxValue, ErrorMessage = "ProductId must be greater than 0.")]
    public int ProductId { get; set; } // hangi ürün sepete eklenecek

    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
    public int Quantity { get; set; } // kaç tane eklenecek
}