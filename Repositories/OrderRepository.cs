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
}