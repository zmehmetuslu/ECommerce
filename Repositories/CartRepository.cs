using ECommerceAPI.Data;
using ECommerceAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Repositories;

public class CartRepository
{
    private readonly AppDbContext _context;

    public CartRepository(AppDbContext context)
    {
        _context = context;
    }

    // Kullanıcının sepetini bulur
public Cart? GetCartByUserId(int userId)
{
    return _context.Carts
        .Include(c => c.Items)
        .ThenInclude(i => i.Product)
        .FirstOrDefault(c => c.UserId == userId);
}

    // Yeni sepet oluşturur
    public void AddCart(Cart cart)
    {
        _context.Carts.Add(cart);
        _context.SaveChanges();
    }

    // Sepete yeni item ekler
    public void AddCartItem(CartItem cartItem)
    {
        _context.CartItems.Add(cartItem);
        _context.SaveChanges();
    }

    // Sepette aynı ürün varsa onu bulur
    public CartItem? GetCartItem(int cartId, int productId)
    {
        return _context.CartItems
            .FirstOrDefault(ci => ci.CartId == cartId && ci.ProductId == productId);
    }

    // Değişiklikleri kaydeder
    public void Save()
    {
        _context.SaveChanges();
    }

    public void RemoveCartItem(CartItem cartItem)
{
    _context.CartItems.Remove(cartItem);
    _context.SaveChanges();
}

public void ClearCart(Cart cart)
{
    _context.CartItems.RemoveRange(cart.Items);
    _context.SaveChanges();
}
}