using System.Security.Claims;
using ECommerceAPI.DTOs;
using ECommerceAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/products/{productId:int}/reviews")]
public class ProductReviewsController : ControllerBase
{
    private readonly ProductReviewService _reviewService;

    public ProductReviewsController(ProductReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public ActionResult<ApiResponse<List<ProductReviewDto>>> GetByProductId(int productId)
    {
        var data = _reviewService.GetByProductId(productId);
        return Ok(ApiResponse<List<ProductReviewDto>>.Ok(data));
    }

    [HttpPost]
    [Authorize]
    public ActionResult<ApiResponse<string>> AddReview(int productId, [FromBody] CreateProductReviewDto dto)
    {
        var username = User.FindFirstValue(ClaimTypes.Name);
        if (string.IsNullOrWhiteSpace(username))
        {
            return Unauthorized(ApiResponse<string>.Fail("Oturum doğrulanamadı."));
        }

        var result = _reviewService.AddReview(productId, username, dto);
        if (!result.Success)
        {
            return BadRequest(ApiResponse<string>.Fail(result.Message));
        }

        return Ok(ApiResponse<string>.Ok(result.Message, result.Message));
    }

    [HttpPut("{reviewId:int}")]
    [Authorize]
    public ActionResult<ApiResponse<string>> UpdateReview(
        int productId,
        int reviewId,
        [FromBody] UpdateProductReviewDto dto)
    {
        var username = User.FindFirstValue(ClaimTypes.Name);
        if (string.IsNullOrWhiteSpace(username))
        {
            return Unauthorized(ApiResponse<string>.Fail("Oturum doğrulanamadı."));
        }

        var result = _reviewService.UpdateReview(productId, reviewId, username, dto);
        if (!result.Success)
        {
            return BadRequest(ApiResponse<string>.Fail(result.Message));
        }

        return Ok(ApiResponse<string>.Ok(result.Message, result.Message));
    }

    [HttpDelete("{reviewId:int}")]
    [Authorize]
    public ActionResult<ApiResponse<string>> DeleteReview(int productId, int reviewId)
    {
        var username = User.FindFirstValue(ClaimTypes.Name);
        if (string.IsNullOrWhiteSpace(username))
        {
            return Unauthorized(ApiResponse<string>.Fail("Oturum doğrulanamadı."));
        }

        var isAdmin = User.IsInRole("Admin");
        var result = _reviewService.DeleteReview(productId, reviewId, username, isAdmin);
        if (!result.Success)
        {
            return BadRequest(ApiResponse<string>.Fail(result.Message));
        }

        return Ok(ApiResponse<string>.Ok(result.Message, result.Message));
    }

    [HttpPost("{reviewId:int}/helpful")]
    [Authorize]
    public ActionResult<ApiResponse<string>> MarkHelpful(int productId, int reviewId)
    {
        var username = User.FindFirstValue(ClaimTypes.Name);
        if (string.IsNullOrWhiteSpace(username))
        {
            return Unauthorized(ApiResponse<string>.Fail("Oturum doğrulanamadı."));
        }

        var result = _reviewService.MarkHelpful(productId, reviewId, username);
        if (!result.Success)
        {
            return BadRequest(ApiResponse<string>.Fail(result.Message));
        }

        return Ok(ApiResponse<string>.Ok(result.Message, result.Message));
    }
}
