using ECommerceAPI.Entities;
using ECommerceAPI.Data;
using ECommerceAPI.Repositories;

namespace ECommerceAPI.Services;

public class OrderService
{
    private readonly AppDbContext _context;
    private readonly OrderRepository _orderRepository;
    private readonly CartRepository _cartRepository;
    private readonly UserRepository _userRepository;
    private readonly CouponService _couponService;

    public OrderService(
        AppDbContext context,
        OrderRepository orderRepository,
        CartRepository cartRepository,
        UserRepository userRepository,
        CouponService couponService)
    {
        _context = context;
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
        _userRepository = userRepository;
        _couponService = couponService;
    }

    public string CreateOrder(
        string username,
        string? couponCode = null,
        string? paymentMethod = null,
        string? mockPaymentOutcome = null)
    {
        var user = _userRepository.GetUserByUsername(username);

        if (user == null)
        {
            return "User not found.";
        }

        var cart = _cartRepository.GetCartByUserId(user.Id);

        if (cart == null || cart.Items == null || cart.Items.Count == 0)
        {
            return "Cart is empty.";
        }

        var subTotal = cart.Items.Sum(item =>
            (item.Product != null ? item.Product.Price : 0) * item.Quantity
        );
        var shippingFee = subTotal >= 1000 ? 0 : 89;

        var normalizedPaymentMethod = string.IsNullOrWhiteSpace(paymentMethod)
            ? "Kapida Odeme"
            : paymentMethod.Trim();
        var normalizedOutcome = string.IsNullOrWhiteSpace(mockPaymentOutcome)
            ? "success"
            : mockPaymentOutcome.Trim().ToLowerInvariant();
        var isMockMethod = !string.Equals(
            normalizedPaymentMethod,
            "Kapida Odeme",
            StringComparison.OrdinalIgnoreCase);
        var isPaymentSuccess = !isMockMethod || normalizedOutcome != "fail";

        if (!isPaymentSuccess)
        {
            return "Ödeme başarısız oldu. Kart bilgilerini kontrol ederek tekrar dene.";
        }

        using var transaction = _context.Database.BeginTransaction();
        try
        {
            var couponConsume = _couponService.ConsumeCoupon(
                couponCode,
                username,
                subTotal,
                shippingFee);
            if (!couponConsume.Success)
            {
                transaction.Rollback();
                return couponConsume.Message;
            }

            var order = new Order
            {
                UserId = user.Id,
                OrderDate = DateTime.Now,
                Status = "Pending",
                PaymentStatus = string.Equals(normalizedPaymentMethod, "Kapida Odeme", StringComparison.OrdinalIgnoreCase)
                    ? "Pending"
                    : "Paid",
                PaymentMethod = normalizedPaymentMethod,
                PaymentReference = $"MOCK-{Guid.NewGuid():N}".ToUpperInvariant(),
                PaymentUpdatedAt = DateTime.UtcNow,
                TotalPrice = subTotal,
                Items = cart.Items.Select(item => new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Product != null ? item.Product.Price : 0
                }).ToList()
            };
            _orderRepository.AddOrder(order);
            _cartRepository.ClearCart(cart);

            transaction.Commit();
            return "Order created successfully.";
        }
        catch
        {
            transaction.Rollback();
            return "Sipariş işlemi sırasında beklenmeyen bir hata oluştu.";
        }
    }

    public List<Order>? GetOrdersByUsername(string username)
    {
        var user = _userRepository.GetUserByUsername(username);

        if (user == null)
        {
            return null;
        }

        return _orderRepository.GetOrdersByUserId(user.Id);
    }

    public List<Order> GetAllOrders()
    {
        return _orderRepository.GetAllOrders();
    }

    public User? GetUserById(int userId)
    {
        return _userRepository.GetUserById(userId);
    }

    public List<OrderStatusLog> GetStatusHistory(int orderId)
    {
        return _orderRepository.GetStatusLogsByOrderId(orderId);
    }

    public (bool Success, string Message) UpdateStatus(int orderId, string status, string changedBy)
    {
        if (!OrderStatusRules.IsValid(status))
        {
            return (false, "Geçersiz sipariş durumu.");
        }

        var order = _orderRepository.GetById(orderId);

        if (order == null)
        {
            return (false, "Sipariş bulunamadı.");
        }

        if (!OrderStatusRules.CanTransition(order.Status, status))
        {
            var labelMap = new Dictionary<string, string>
            {
                { OrderStatusRules.Pending, "Beklemede" },
                { OrderStatusRules.Preparing, "Hazırlanıyor" },
                { OrderStatusRules.Shipped, "Kargoda" },
                { OrderStatusRules.Delivered, "Teslim Edildi" },
                { OrderStatusRules.Cancelled, "İptal" }
            };

            var fromLabel = labelMap.GetValueOrDefault(order.Status, order.Status);
            var toLabel = labelMap.GetValueOrDefault(status, status);

            return (false, $"Durum {fromLabel} -> {toLabel} olarak değiştirilemez.");
        }

        var oldStatus = order.Status;
        order.Status = status;
        _orderRepository.Update(order);
        _orderRepository.AddStatusLog(new OrderStatusLog
        {
            OrderId = order.Id,
            OldStatus = oldStatus,
            NewStatus = status,
            ChangedBy = changedBy,
            ChangedAt = DateTime.UtcNow
        });

        return (true, "Sipariş durumu güncellendi.");
    }

    public (bool Success, string Message) UpdatePaymentStatus(int orderId, string paymentStatus)
    {
        var validStatuses = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "Pending",
            "Paid",
            "Failed"
        };

        if (!validStatuses.Contains(paymentStatus))
        {
            return (false, "Geçersiz ödeme durumu.");
        }

        var order = _orderRepository.GetById(orderId);
        if (order == null)
        {
            return (false, "Sipariş bulunamadı.");
        }

        order.PaymentStatus = paymentStatus;
        order.PaymentUpdatedAt = DateTime.UtcNow;
        _orderRepository.Update(order);

        return (true, "Ödeme durumu güncellendi.");
    }
}













/*
BU DOSYANIN AÇIKLAMASI:

Bu service, sipariş işlemlerinin iş mantığını içerir.
Kullanıcının sepetini siparişe dönüştürmesi ve siparişleri görüntülemesi burada yönetilir.

ÇALIŞMA MANTIĞI:
- Token'dan gelen username ile kullanıcı bulunur
- Kullanıcının sepeti alınır
- Sepet içeriği siparişe dönüştürülür
- Sipariş veritabanına kaydedilir
- Sepet temizlenir

YAPILAN İŞLEMLER:

CreateOrder:
- Kullanıcı ve sepet bulunur
- Sepet boş değilse yeni Order oluşturulur
- Sepetteki ürünler OrderItem'a çevrilir
- Toplam fiyat hesaplanır
- Sipariş kaydedilir
- Sepet temizlenir

GetOrdersByUsername:
- Kullanıcının siparişlerini getirir

UpdateStatus:
- Admin tarafından sipariş durumu güncellenir (Pending, Completed vb.)

BAĞLANTILI DOSYALAR:
- OrderController.cs → bu service'i çağırır
- OrderRepository.cs → sipariş veritabanı işlemleri
- CartRepository.cs → sipariş sonrası sepet temizlenir
- UserRepository.cs → kullanıcıyı bulmak için
- Cart.jsx → sipariş oluşturma işlemi buradan yapılır
- Orders.jsx → siparişler burada listelenir

NOT:
Sipariş oluşturma işlemi aslında cart → order dönüşümüdür.
Sepet temizlenerek yeni sipariş süreci başlatılır.
*/