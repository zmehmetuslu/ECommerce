using System.ComponentModel.DataAnnotations;

namespace ECommerceAPI.DTOs;

public class UpdateCartItemQuantityDto
{
    [Range(0, int.MaxValue, ErrorMessage = "Quantity cannot be negative.")]
    public int Quantity { get; set; } // sepette ürünün yeni adedi
}