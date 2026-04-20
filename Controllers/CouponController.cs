using ECommerceAPI.DTOs;
using ECommerceAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponController : ControllerBase
{
    private readonly CouponService _couponService;

    public CouponController(CouponService couponService)
    {
        _couponService = couponService;
    }

    [HttpPost("validate")]
    public IActionResult ValidateCoupon([FromBody] ValidateCouponDto dto)
    {
        dto.Username ??= User.Identity?.Name;
        var result = _couponService.Validate(dto);
        if (!result.IsValid)
        {
            return BadRequest(ApiResponse<CouponValidationResultDto>.Fail(result.Message));
        }

        return Ok(ApiResponse<CouponValidationResultDto>.Ok(result, result.Message));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public IActionResult GetCouponsForAdmin()
    {
        var coupons = _couponService.GetAllForAdmin();
        return Ok(ApiResponse<List<CouponAdminDto>>.Ok(coupons));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("admin")]
    public IActionResult CreateCoupon([FromBody] CreateCouponDto dto)
    {
        var result = _couponService.CreateCoupon(dto);
        if (!result.Success)
        {
            return BadRequest(ApiResponse<object>.Fail(result.Message));
        }

        return Ok(ApiResponse<object>.Ok(null, result.Message));
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("admin/{id}/toggle-active")]
    public IActionResult ToggleCouponActive(int id)
    {
        var result = _couponService.ToggleActive(id);
        if (!result.Success)
        {
            return NotFound(ApiResponse<object>.Fail(result.Message));
        }

        return Ok(ApiResponse<object>.Ok(null, result.Message));
    }
}
