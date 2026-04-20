using ECommerceAPI.Data;
using ECommerceAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Repositories;

public class OrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    // Yeni order ekler
    public void AddOrder(Order order)
    {
        _context.Orders.Add(order);
        _context.SaveChanges();
    }

    // Kullanıcının siparişlerini getirir
 public List<Order> GetOrdersByUserId(int userId)
{
    return _context.Orders
        .Where(o => o.UserId == userId)
        .Include(o => o.Items)
        .ThenInclude(i => i.Product)
        .ToList();
}

public Order? GetById(int id)
{
    return _context.Orders
        .Include(o => o.Items)
        .FirstOrDefault(o => o.Id == id);
}

public void Update(Order order)
{
    _context.Orders.Update(order);
    _context.SaveChanges();
}

public List<Order> GetAllOrders()
{
    return _context.Orders
        .Include(o => o.Items)
        .ThenInclude(i => i.Product)
        .OrderByDescending(o => o.OrderDate)
        .ToList();
}

public void AddStatusLog(OrderStatusLog log)
{
    _context.OrderStatusLogs.Add(log);
    _context.SaveChanges();
}

public List<OrderStatusLog> GetStatusLogsByOrderId(int orderId)
{
    return _context.OrderStatusLogs
        .Where(l => l.OrderId == orderId)
        .OrderByDescending(l => l.ChangedAt)
        .ToList();
}

public bool HasDeliveredOrderForProduct(int userId, int productId)
{
    return _context.Orders.Any(o =>
        o.UserId == userId &&
        o.Status == "Delivered" &&
        o.Items.Any(i => i.ProductId == productId));
}
}