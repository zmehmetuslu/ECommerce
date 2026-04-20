namespace ECommerceAPI.DTOs;

public class ProductReviewSummaryDto
{
    public int ProductId { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
}
