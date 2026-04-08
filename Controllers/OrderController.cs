using ECommerceAPI.DTOs;
using ECommerceAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace ECommerceAPI.Controllers;




[ApiController]
[Route("api/[controller]")]
[Authorize] // Sipariş işlemleri için login olmak zorunlu
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrderController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [Authorize(Roles = "Admin")]
[HttpPut("{id}/status")]
public IActionResult UpdateStatus(int id, [FromBody] string status)
{
    _orderService.UpdateStatus(id, status);
    return Ok("Status updated.");
}


    [HttpPost("create")]
    public IActionResult CreateOrder()
    {
        // Token'dan kullanıcı adını alıyoruz
        var username = User.Identity?.Name;

        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized("User not found in token.");
        }

        // Service'e gönderiyoruz
        var result = _orderService.CreateOrder(username);

        if (result == "Order created successfully.")
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpGet]
public IActionResult GetOrders()
{
    // Token'dan kullanıcı adını alıyoruz
    var username = User.Identity?.Name;

    if (string.IsNullOrEmpty(username))
    {
        return Unauthorized("User not found in token.");
    }

    // Service'e gidip bu kullanıcıya ait siparişleri alıyoruz
    var orders = _orderService.GetOrdersByUsername(username);

    if (orders == null)
    {
        return BadRequest("User not found.");
    }

    // Entity → DTO dönüşümü
    var orderDtos = orders.Select(order => new OrderDto
    {
        OrderId = order.Id,
        OrderDate = order.OrderDate,
        Items = order.Items.Select(item => new OrderItemDto
        {
            ProductId = item.ProductId,
            ProductName = item.Product?.Name ?? string.Empty,
            Quantity = item.Quantity,
            Price = item.Price,
            LineTotal = item.Price * item.Quantity
        }).ToList(),
        TotalPrice = order.Items.Sum(item => item.Price * item.Quantity)
    }).ToList();

    

    return Ok(orderDtos);

    
}

    
}