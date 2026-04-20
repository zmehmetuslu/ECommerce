using ECommerceAPI.DTOs;
using ECommerceAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly WishlistService _wishlistService;

    public WishlistController(WishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    [HttpGet]
    public IActionResult GetWishlist()
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(username))
        {
            return Unauthorized(ApiResponse<object>.Fail("User not found in token."));
        }

        var result = _wishlistService.GetWishlist(username);
        if (!result.Success)
        {
            return BadRequest(ApiResponse<object>.Fail(result.Message));
        }

        return Ok(ApiResponse<List<WishlistItemDto>>.Ok(result.Items));
    }

    [HttpPost("{productId}")]
    public IActionResult AddToWishlist(int productId)
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(username))
        {
            return Unauthorized(ApiResponse<object>.Fail("User not found in token."));
        }

        var result = _wishlistService.AddToWishlist(username, productId);
        if (!result.Success)
        {
            return BadRequest(ApiResponse<object>.Fail(result.Message));
        }

        return Ok(ApiResponse<object>.Ok(null, result.Message));
    }

    [HttpDelete("{productId}")]
    public IActionResult RemoveFromWishlist(int productId)
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(username))
        {
            return Unauthorized(ApiResponse<object>.Fail("User not found in token."));
        }

        var result = _wishlistService.RemoveFromWishlist(username, productId);
        if (!result.Success)
        {
            return BadRequest(ApiResponse<object>.Fail(result.Message));
        }

        return Ok(ApiResponse<object>.Ok(null, result.Message));
    }
}
