using System.ComponentModel.DataAnnotations;

namespace ECommerceAPI.DTOs;

public class CreateProductReviewDto
{
    [Range(1, 5, ErrorMessage = "Puan 1 ile 5 arasında olmalı.")]
    public int Rating { get; set; }

    [Required(ErrorMessage = "Yorum boş olamaz.")]
    [StringLength(600, ErrorMessage = "Yorum en fazla 600 karakter olabilir.")]
    public string Comment { get; set; } = string.Empty;
}
