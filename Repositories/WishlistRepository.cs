using ECommerceAPI.Data;
using ECommerceAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Repositories;

public class WishlistRepository
{
    private readonly AppDbContext _context;

    public WishlistRepository(AppDbContext context)
    {
        _context = context;
    }

    public List<WishlistItem> GetByUserId(int userId)
    {
        return _context.WishlistItems
            .Include(x => x.Product)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();
    }

    public WishlistItem? GetByUserAndProduct(int userId, int productId)
    {
        return _context.WishlistItems
            .FirstOrDefault(x => x.UserId == userId && x.ProductId == productId);
    }

    public void Add(WishlistItem item)
    {
        _context.WishlistItems.Add(item);
        _context.SaveChanges();
    }

    public void Remove(WishlistItem item)
    {
        _context.WishlistItems.Remove(item);
        _context.SaveChanges();
    }
}
