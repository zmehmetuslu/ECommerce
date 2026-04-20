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
    public IActionResult UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var changedBy = User.Identity?.Name ?? "Unknown";
        var result = _orderService.UpdateStatus(id, dto.Status, changedBy);

        if (!result.Success)
        {
            return BadRequest(ApiResponse<object>.Fail(result.Message));
        }

        return Ok(ApiResponse<object>.Ok(null, result.Message));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/payment-status")]
    public IActionResult UpdatePaymentStatus(int id, [FromBody] UpdatePaymentStatusDto dto)
    {
        var result = _orderService.UpdatePaymentStatus(id, dto.PaymentStatus);
        if (!result.Success)
        {
            return BadRequest(ApiResponse<object>.Fail(result.Message));
        }

        return Ok(ApiResponse<object>.Ok(null, result.Message));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id}/status-history")]
    public IActionResult GetStatusHistory(int id)
    {
        var history = _orderService.GetStatusHistory(id);
        var dtos = history.Select(log => new OrderStatusLogDto
        {
            OldStatus = log.OldStatus,
            NewStatus = log.NewStatus,
            ChangedBy = log.ChangedBy,
            ChangedAt = log.ChangedAt
        }).ToList();

        return Ok(ApiResponse<List<OrderStatusLogDto>>.Ok(dtos));
    }


    [HttpPost("create")]
    public IActionResult CreateOrder([FromBody] CreateOrderRequestDto? dto)
    {
        // Token'dan kullanıcı adını alıyoruz
        var username = User.Identity?.Name;

        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized(ApiResponse<object>.Fail("User not found in token."));
        }

        // Service'e gönderiyoruz
        var result = _orderService.CreateOrder(
            username,
            dto?.CouponCode,
            dto?.PaymentMethod,
            dto?.MockPaymentOutcome
        );

        if (result == "Order created successfully.")
        {
            return Ok(ApiResponse<object>.Ok(null, result));
        }

        return BadRequest(ApiResponse<object>.Fail(result));
    }

    [HttpGet]
    public IActionResult GetOrders()
    {
        // Token'dan kullanıcı adını alıyoruz
        var username = User.Identity?.Name;

        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized(ApiResponse<object>.Fail("User not found in token."));
        }

        // Service'e gidip bu kullanıcıya ait siparişleri alıyoruz
        var orders = _orderService.GetOrdersByUsername(username);

        if (orders == null)
        {
            return BadRequest(ApiResponse<object>.Fail("User not found."));
        }

        // Entity → DTO dönüşümü
        var orderDtos = orders.Select(order => new OrderDto
        {
            OrderId = order.Id,
            Status = order.Status,
            PaymentStatus = order.PaymentStatus,
            PaymentMethod = order.PaymentMethod,
            PaymentReference = order.PaymentReference ?? string.Empty,
            Username = username,
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

        return Ok(ApiResponse<List<OrderDto>>.Ok(orderDtos));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public IActionResult GetAllOrders()
    {
        var orders = _orderService.GetAllOrders();

        var orderDtos = orders.Select(order =>
        {
            var user = _orderService.GetUserById(order.UserId);

            return new OrderDto
            {
                OrderId = order.Id,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                PaymentMethod = order.PaymentMethod,
                PaymentReference = order.PaymentReference ?? string.Empty,
                Username = user?.Username ?? "Unknown User",
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
            };
        }).ToList();

        return Ok(ApiResponse<List<OrderDto>>.Ok(orderDtos));
    }

    
}
















/*
BU DOSYANIN AÇIKLAMASI:

Bu controller, sipariş işlemlerini yönetir.
Kullanıcının sipariş oluşturması, siparişlerini görüntülemesi ve admin tarafından sipariş durumunun güncellenmesi işlemleri burada yapılır.
[Authorize] kullanıldığı için sipariş işlemleri için kullanıcı giriş yapmış olmalıdır.

ÇALIŞMA MANTIĞI:
- Frontend'den gelen istekler bu controller'a gelir
- Token içinden kullanıcı adı alınır
- İşlemler OrderService'e gönderilir
- Veriler DTO'ya çevrilerek frontend'e döndürülür

YAPILAN İŞLEMLER:
- CreateOrder → sepeti siparişe dönüştürür ve sepeti temizler
- GetOrders → kullanıcının siparişlerini listeler
- UpdateStatus → (sadece admin) sipariş durumunu günceller

BAĞLANTILI DOSYALAR:
- OrderService.cs → sipariş oluşturma mantığı burada
- OrderRepository.cs → veritabanı işlemleri
- CartRepository.cs → sipariş oluştururken sepet temizlenir
- Cart.jsx → sipariş oluşturma işlemi buradan yapılır
- Orders.jsx → siparişler burada listelenir
- Admin.jsx → sipariş durum güncelleme burada yapılır

NOT:
Sipariş oluşturma işlemi aslında cart → order dönüşümüdür.
DTO kullanılarak sipariş verileri frontend'e düzenli şekilde gönderilir.
*/