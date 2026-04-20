using ECommerceAPI.DTOs;
using ECommerceAPI.Entities;
using ECommerceAPI.Repositories;

namespace ECommerceAPI.Services;

public class ProductReviewService
{
    private readonly ProductReviewRepository _reviewRepository;
    private readonly ProductRepository _productRepository;
    private readonly UserRepository _userRepository;
    private readonly OrderRepository _orderRepository;

    public ProductReviewService(
        ProductReviewRepository reviewRepository,
        ProductRepository productRepository,
        UserRepository userRepository,
        OrderRepository orderRepository)
    {
        _reviewRepository = reviewRepository;
        _productRepository = productRepository;
        _userRepository = userRepository;
        _orderRepository = orderRepository;
    }

    public List<ProductReviewDto> GetByProductId(int productId)
    {
        return _reviewRepository.GetByProductId(productId)
            .Where(r => r.IsVisible)
            .Select(r => new ProductReviewDto
            {
                Id = r.Id,
                ProductId = r.ProductId,
                Username = r.User?.Username ?? "Bilinmeyen Kullanıcı",
                Rating = r.Rating,
                Comment = r.Comment,
                HelpfulCount = r.HelpfulCount,
                IsVisible = r.IsVisible,
                CreatedAt = r.CreatedAt
            })
            .ToList();
    }

    public (bool Success, string Message) AddReview(int productId, string username, CreateProductReviewDto dto)
    {
        var product = _productRepository.GetProductById(productId);
        if (product == null)
        {
            return (false, "Ürün bulunamadı.");
        }

        var user = _userRepository.GetUserByUsername(username);
        if (user == null)
        {
            return (false, "Kullanıcı bulunamadı.");
        }

        if (_reviewRepository.ExistsByUserForProduct(productId, user.Id))
        {
            return (false, "Bu ürün için zaten yorum yaptın.");
        }

        var canReview = _orderRepository.HasDeliveredOrderForProduct(user.Id, productId);
        if (!canReview)
        {
            return (false, "Bu ürün için yorum yazabilmek adına teslim edilmiş siparişin olmalı.");
        }

        _reviewRepository.Add(new ProductReview
        {
            ProductId = productId,
            UserId = user.Id,
            Rating = dto.Rating,
            Comment = dto.Comment.Trim(),
            HelpfulCount = 0,
            IsVisible = true,
            CreatedAt = DateTime.UtcNow
        });

        return (true, "Yorumun başarıyla eklendi.");
    }

    public (bool Success, string Message) UpdateReview(
        int productId,
        int reviewId,
        string username,
        UpdateProductReviewDto dto)
    {
        var review = _reviewRepository.GetById(reviewId);
        if (review == null || review.ProductId != productId)
        {
            return (false, "Yorum bulunamadı.");
        }

        var user = _userRepository.GetUserByUsername(username);
        if (user == null)
        {
            return (false, "Kullanıcı bulunamadı.");
        }

        if (review.UserId != user.Id)
        {
            return (false, "Sadece kendi yorumunu güncelleyebilirsin.");
        }

        review.Rating = dto.Rating;
        review.Comment = dto.Comment.Trim();
        _reviewRepository.Update(review);
        return (true, "Yorum güncellendi.");
    }

    public (bool Success, string Message) DeleteReview(int productId, int reviewId, string username, bool isAdmin)
    {
        var review = _reviewRepository.GetById(reviewId);
        if (review == null || review.ProductId != productId)
        {
            return (false, "Yorum bulunamadı.");
        }

        if (!isAdmin)
        {
            var user = _userRepository.GetUserByUsername(username);
            if (user == null || review.UserId != user.Id)
            {
                return (false, "Sadece kendi yorumunu silebilirsin.");
            }
        }

        _reviewRepository.Delete(review);
        return (true, "Yorum silindi.");
    }

    public List<AdminProductReviewDto> GetAllForAdmin()
    {
        return _reviewRepository.GetAll()
            .Select(r => new AdminProductReviewDto
            {
                Id = r.Id,
                ProductId = r.ProductId,
                ProductName = r.Product?.Name ?? "-",
                Username = r.User?.Username ?? "Bilinmeyen Kullanıcı",
                Rating = r.Rating,
                Comment = r.Comment,
                HelpfulCount = r.HelpfulCount,
                IsVisible = r.IsVisible,
                CreatedAt = r.CreatedAt
            })
            .ToList();
    }

    public (bool Success, string Message) ToggleVisibility(int reviewId)
    {
        var review = _reviewRepository.GetById(reviewId);
        if (review == null)
        {
            return (false, "Yorum bulunamadı.");
        }

        review.IsVisible = !review.IsVisible;
        _reviewRepository.Update(review);
        return (true, review.IsVisible ? "Yorum görünür yapıldı." : "Yorum gizlendi.");
    }

    public List<ProductReviewSummaryDto> GetSummaries(IEnumerable<int> productIds)
    {
        var map = _reviewRepository.GetSummaries(productIds);
        return map.Select(x => new ProductReviewSummaryDto
        {
            ProductId = x.Key,
            AverageRating = x.Value.AverageRating,
            ReviewCount = x.Value.ReviewCount
        }).ToList();
    }

    public (bool Success, string Message) DeleteByIdAsAdmin(int reviewId)
    {
        var review = _reviewRepository.GetById(reviewId);
        if (review == null)
        {
            return (false, "Yorum bulunamadı.");
        }

        _reviewRepository.Delete(review);
        return (true, "Yorum silindi.");
    }

    public (bool Success, string Message) MarkHelpful(int productId, int reviewId, string username)
    {
        var review = _reviewRepository.GetById(reviewId);
        if (review == null || review.ProductId != productId || !review.IsVisible)
        {
            return (false, "Yorum bulunamadı.");
        }

        var user = _userRepository.GetUserByUsername(username);
        if (user == null)
        {
            return (false, "Kullanıcı bulunamadı.");
        }

        if (review.UserId == user.Id)
        {
            return (false, "Kendi yorumunu faydalı işaretleyemezsin.");
        }

        if (_reviewRepository.HelpfulVoteExists(reviewId, user.Id))
        {
            return (false, "Bu yorumu zaten faydalı işaretledin.");
        }

        _reviewRepository.AddHelpfulVote(reviewId, user.Id);
        review.HelpfulCount += 1;
        _reviewRepository.Update(review);
        return (true, "Yorum faydalı olarak işaretlendi.");
    }
}
