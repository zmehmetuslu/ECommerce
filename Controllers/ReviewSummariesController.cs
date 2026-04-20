using ECommerceAPI.DTOs;
using ECommerceAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/reviews/summaries")]
public class ReviewSummariesController : ControllerBase
{
    private readonly ProductReviewService _reviewService;

    public ReviewSummariesController(ProductReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public ActionResult<ApiResponse<List<ProductReviewSummaryDto>>> GetSummaries([FromQuery] string productIds)
    {
        var ids = (productIds ?? string.Empty)
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(x => int.TryParse(x, out var id) ? id : 0)
            .Where(id => id > 0)
            .Distinct()
            .ToList();

        var data = _reviewService.GetSummaries(ids);
        return Ok(ApiResponse<List<ProductReviewSummaryDto>>.Ok(data));
    }
}
