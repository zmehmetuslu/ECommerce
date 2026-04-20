using ECommerceAPI.DTOs;
using ECommerceAPI.Entities;
using ECommerceAPI.Repositories;

namespace ECommerceAPI.Services;

public class WishlistService
{
    private readonly WishlistRepository _wishlistRepository;
    private readonly UserRepository _userRepository;
    private readonly ProductRepository _productRepository;

    public WishlistService(
        WishlistRepository wishlistRepository,
        UserRepository userRepository,
        ProductRepository productRepository)
    {
        _wishlistRepository = wishlistRepository;
        _userRepository = userRepository;
        _productRepository = productRepository;
    }

    public (bool Success, string Message, List<WishlistItemDto> Items) GetWishlist(string username)
    {
        var user = _userRepository.GetUserByUsername(username);
        if (user == null)
        {
            return (false, "Kullanıcı bulunamadı.", new List<WishlistItemDto>());
        }

        var items = _wishlistRepository.GetByUserId(user.Id)
            .Select(x => new WishlistItemDto
            {
                ProductId = x.ProductId,
                ProductName = x.Product?.Name ?? string.Empty,
                Price = x.Product?.Price ?? 0,
                Stock = x.Product?.Stock ?? 0,
                ImageUrl = x.Product?.ImageUrl ?? string.Empty,
                AddedAt = x.CreatedAt
            })
            .ToList();

        return (true, "OK", items);
    }

    public (bool Success, string Message) AddToWishlist(string username, int productId)
    {
        var user = _userRepository.GetUserByUsername(username);
        if (user == null)
        {
            return (false, "Kullanıcı bulunamadı.");
        }

        var product = _productRepository.GetProductById(productId);
        if (product == null)
        {
            return (false, "Ürün bulunamadı.");
        }

        var existing = _wishlistRepository.GetByUserAndProduct(user.Id, productId);
        if (existing != null)
        {
            return (true, "Ürün zaten favorilerde.");
        }

        _wishlistRepository.Add(new WishlistItem
        {
            UserId = user.Id,
            ProductId = productId,
            CreatedAt = DateTime.UtcNow
        });

        return (true, "Ürün favorilere eklendi.");
    }

    public (bool Success, string Message) RemoveFromWishlist(string username, int productId)
    {
        var user = _userRepository.GetUserByUsername(username);
        if (user == null)
        {
            return (false, "Kullanıcı bulunamadı.");
        }

        var existing = _wishlistRepository.GetByUserAndProduct(user.Id, productId);
        if (existing == null)
        {
            return (false, "Ürün favorilerde bulunamadı.");
        }

        _wishlistRepository.Remove(existing);
        return (true, "Ürün favorilerden kaldırıldı.");
    }
}
