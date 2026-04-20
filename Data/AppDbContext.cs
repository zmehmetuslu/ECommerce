using Microsoft.EntityFrameworkCore;
using ECommerceAPI.Entities;

namespace ECommerceAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }

    public DbSet<Category> Categories { get; set; }


    public DbSet<User> Users { get; set; }

    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }

    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<OrderStatusLog> OrderStatusLogs { get; set; }
    public DbSet<WishlistItem> WishlistItems { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
    public DbSet<CouponUsage> CouponUsages { get; set; }
    public DbSet<ProductReview> ProductReviews { get; set; }
    public DbSet<ReviewHelpfulVote> ReviewHelpfulVotes { get; set; }
}