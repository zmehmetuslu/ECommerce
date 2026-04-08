using System.ComponentModel.DataAnnotations;

namespace ECommerceAPI.DTOs;

public class CreateCategoryDto
{
    [Required(ErrorMessage = "Category name is required.")]
    [StringLength(100, ErrorMessage = "Category name can be at most 100 characters.")]
    public string Name { get; set; } = string.Empty;
}