using ECommerceAPI.DTOs;
using ECommerceAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Cart işlemleri için giriş yapmak zorunlu
public class CartController : ControllerBase
{
    private readonly CartService _cartService;

    public CartController(CartService cartService)
    {
        _cartService = cartService;
    }

    [HttpPost("add")]
    public IActionResult AddToCart(AddToCartDto dto)
    {
        // Token'dan gelen kullanıcı adını alıyoruz
        var username = User.Identity?.Name;

        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized("User not found in token.");
        }

        // Service'e gönderiyoruz
        var result = _cartService.AddToCart(username, dto.ProductId, dto.Quantity);

        if (result == "Product added to cart successfully.")
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpGet]
public IActionResult GetCart()
{
    // Token'dan gelen kullanıcı adını alıyoruz
    var username = User.Identity?.Name;

    if (string.IsNullOrEmpty(username))
    {
        return Unauthorized("User not found in token.");
    }

    // Service'e gidip kullanıcının sepetini alıyoruz
    var cart = _cartService.GetCartByUsername(username);

    if (cart == null)
    {
        return Ok(new CartDto()); // sepet yoksa boş sepet dön
    }

    // Entity → DTO dönüşümü yapıyoruz
  var cartDto = new CartDto
{
    Items = cart.Items.Select(item => new CartItemDto
    {
        ProductId = item.ProductId, // ürün id
        ProductName = item.Product?.Name ?? string.Empty, // ürün adı
        Quantity = item.Quantity, // kaç tane
        Price = item.Product?.Price ?? 0, // tek fiyat
        LineTotal = (item.Product?.Price ?? 0) * item.Quantity // satır toplamı
    }).ToList()
};

// bütün satır toplamlarını toplayıp sepet toplamını hesaplıyoruz
cartDto.TotalPrice = cartDto.Items.Sum(i => i.LineTotal);

return Ok(cartDto);
}

[HttpDelete("remove/{productId}")]
public IActionResult RemoveFromCart(int productId)
{
    // Token'dan kullanıcı adını alıyoruz
    var username = User.Identity?.Name;

    if (string.IsNullOrEmpty(username))
    {
        return Unauthorized("User not found in token.");
    }

    // Service'e gönderiyoruz
    var result = _cartService.RemoveFromCart(username, productId);

    if (result == "Product removed from cart successfully.")
    {
        return Ok(result);
    }

    return BadRequest(result);
}
[HttpPut("update-quantity/{productId}")]
public IActionResult UpdateCartItemQuantity(int productId, UpdateCartItemQuantityDto dto)
{
    // Token'dan kullanıcı adını alıyoruz
    var username = User.Identity?.Name;

    if (string.IsNullOrEmpty(username))
    {
        return Unauthorized("User not found in token.");
    }

    // Service'e gidip quantity güncellemesini yapıyoruz
    var result = _cartService.UpdateCartItemQuantity(username, productId, dto.Quantity);

    if (result == "Cart item quantity updated successfully." || result == "Product removed from cart.")
    {
        return Ok(result);
    }

    return BadRequest(result);
}
}