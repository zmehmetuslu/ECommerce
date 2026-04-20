namespace ECommerceAPI.DTOs;

public class AdminProductReviewDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public int HelpfulCount { get; set; }
    public bool IsVisible { get; set; }
    public DateTime CreatedAt { get; set; }
}
