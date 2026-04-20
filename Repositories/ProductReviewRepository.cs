using ECommerceAPI.Data;
using ECommerceAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Repositories;

public class ProductReviewRepository
{
    private readonly AppDbContext _context;

    public ProductReviewRepository(AppDbContext context)
    {
        _context = context;
    }

    public List<ProductReview> GetByProductId(int productId)
    {
        return _context.ProductReviews
            .Include(r => r.User)
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .ToList();
    }

    public List<ProductReview> GetAll()
    {
        return _context.ProductReviews
            .Include(r => r.User)
            .Include(r => r.Product)
            .OrderByDescending(r => r.CreatedAt)
            .ToList();
    }

    public ProductReview? GetById(int reviewId)
    {
        return _context.ProductReviews
            .Include(r => r.User)
            .Include(r => r.Product)
            .FirstOrDefault(r => r.Id == reviewId);
    }

    public bool ExistsByUserForProduct(int productId, int userId)
    {
        return _context.ProductReviews.Any(r => r.ProductId == productId && r.UserId == userId);
    }

    public bool HelpfulVoteExists(int reviewId, int userId)
    {
        return _context.ReviewHelpfulVotes.Any(v => v.ReviewId == reviewId && v.UserId == userId);
    }

    public void Add(ProductReview review)
    {
        _context.ProductReviews.Add(review);
        _context.SaveChanges();
    }

    public void Update(ProductReview review)
    {
        _context.ProductReviews.Update(review);
        _context.SaveChanges();
    }

    public void Delete(ProductReview review)
    {
        _context.ProductReviews.Remove(review);
        _context.SaveChanges();
    }

    public void AddHelpfulVote(int reviewId, int userId)
    {
        _context.ReviewHelpfulVotes.Add(new ReviewHelpfulVote
        {
            ReviewId = reviewId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        });
        _context.SaveChanges();
    }

    public Dictionary<int, (double AverageRating, int ReviewCount)> GetSummaries(IEnumerable<int> productIds)
    {
        var ids = productIds.Distinct().ToList();
        if (ids.Count == 0)
        {
            return new Dictionary<int, (double AverageRating, int ReviewCount)>();
        }

        return _context.ProductReviews
            .Where(r => ids.Contains(r.ProductId) && r.IsVisible)
            .GroupBy(r => r.ProductId)
            .Select(g => new
            {
                ProductId = g.Key,
                AverageRating = g.Average(x => x.Rating),
                ReviewCount = g.Count()
            })
            .ToDictionary(
                x => x.ProductId,
                x => (Math.Round(x.AverageRating, 1), x.ReviewCount));
    }
}
