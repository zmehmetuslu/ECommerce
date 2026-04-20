using ECommerceAPI.Data;
using ECommerceAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Repositories;

public class CouponRepository
{
    private readonly AppDbContext _context;

    public CouponRepository(AppDbContext context)
    {
        _context = context;
    }

    public Coupon? GetByCode(string code)
    {
        return _context.Coupons.FirstOrDefault(c =>
            c.Code.ToLower() == code.ToLower());
    }

    public Coupon? GetById(int id)
    {
        return _context.Coupons.FirstOrDefault(c => c.Id == id);
    }

    public List<Coupon> GetAll()
    {
        return _context.Coupons
            .OrderByDescending(c => c.Id)
            .ToList();
    }

    public int GetUserUsageCount(int couponId, int userId)
    {
        return _context.CouponUsages.Count(x => x.CouponId == couponId && x.UserId == userId);
    }

    public void Add(Coupon coupon)
    {
        _context.Coupons.Add(coupon);
        _context.SaveChanges();
    }

    public void AddUsage(CouponUsage usage)
    {
        _context.CouponUsages.Add(usage);
        _context.SaveChanges();
    }

    public void Update(Coupon coupon)
    {
        _context.Coupons.Update(coupon);
        _context.SaveChanges();
    }
}
