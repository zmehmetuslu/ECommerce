using ECommerceAPI.DTOs;
using ECommerceAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/admin/reviews")]
[Authorize(Roles = "Admin")]
public class AdminReviewsController : ControllerBase
{
    private readonly ProductReviewService _reviewService;

    public AdminReviewsController(ProductReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public ActionResult<ApiResponse<List<AdminProductReviewDto>>> GetAll()
    {
        var data = _reviewService.GetAllForAdmin();
        return Ok(ApiResponse<List<AdminProductReviewDto>>.Ok(data));
    }

    [HttpPatch("{reviewId:int}/toggle-visibility")]
    public ActionResult<ApiResponse<string>> ToggleVisibility(int reviewId)
    {
        var result = _reviewService.ToggleVisibility(reviewId);
        if (!result.Success)
        {
            return NotFound(ApiResponse<string>.Fail(result.Message));
        }

        return Ok(ApiResponse<string>.Ok(result.Message, result.Message));
    }

    [HttpDelete("{reviewId:int}")]
    public ActionResult<ApiResponse<string>> DeleteReview(int reviewId)
    {
        var result = _reviewService.DeleteByIdAsAdmin(reviewId);
        if (!result.Success)
        {
            return NotFound(ApiResponse<string>.Fail(result.Message));
        }

        return Ok(ApiResponse<string>.Ok(result.Message, result.Message));
    }
}
