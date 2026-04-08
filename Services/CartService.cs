using ECommerceAPI.Entities;
using ECommerceAPI.Repositories;

namespace ECommerceAPI.Services;

public class CartService
{
    private readonly CartRepository _cartRepository;
    private readonly ProductRepository _productRepository;
    private readonly UserRepository _userRepository;

    public CartService(
        CartRepository cartRepository,
        ProductRepository productRepository,
        UserRepository userRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
        _userRepository = userRepository;
    }

    public string AddToCart(string username, int productId, int quantity)
    {
        // Token'dan gelen username ile kullanıcıyı buluyoruz
        var user = _userRepository.GetUserByUsername(username);

        if (user == null)
        {
            return "User not found.";
        }

        // Eklenmek istenen ürünü buluyoruz
        var product = _productRepository.GetProductById(productId);

        if (product == null)
        {
            return "Product not found.";
        }

        // Stok yeterli mi kontrol ediyoruz
        if (product.Stock < quantity)
        {
            return "Not enough stock.";
        }

        // Kullanıcının sepeti var mı bakıyoruz
        var cart = _cartRepository.GetCartByUserId(user.Id);

        // Yoksa yeni sepet oluşturuyoruz
        if (cart == null)
        {
            cart = new Cart
            {
                UserId = user.Id
            };

            _cartRepository.AddCart(cart);

            // yeni oluşan sepeti tekrar çekiyoruz
            cart = _cartRepository.GetCartByUserId(user.Id);
        }

        if (cart == null)
        {
            return "Cart could not be created.";
        }

        // Aynı ürün sepette zaten varsa
        var existingCartItem = _cartRepository.GetCartItem(cart.Id, productId);

        if (existingCartItem != null)
        {
            // quantity artır
            existingCartItem.Quantity += quantity;
            _cartRepository.Save();
        }
        else
        {
            // yeni cart item oluştur
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = productId,
                Quantity = quantity
            };

            _cartRepository.AddCartItem(cartItem);
        }

        // HOCANIN İSTEDİĞİ KISIM:
        // Ürün sepete eklenince stoktan düş
        product.Stock -= quantity;

        _productRepository.UpdateProduct(product.Id, product);

        return "Product added to cart successfully.";
    }

    public Cart? GetCartByUsername(string username)
{
    // Token'dan gelen username ile kullanıcıyı buluyoruz
    var user = _userRepository.GetUserByUsername(username);

    if (user == null)
    {
        return null;
    }

    // Kullanıcının sepetini getiriyoruz
    return _cartRepository.GetCartByUserId(user.Id);
}

public string RemoveFromCart(string username, int productId)
{
    // Token'dan gelen username ile kullanıcıyı buluyoruz
    var user = _userRepository.GetUserByUsername(username);

    if (user == null)
    {
        return "User not found.";
    }

    // Kullanıcının sepetini buluyoruz
    var cart = _cartRepository.GetCartByUserId(user.Id);

    if (cart == null)
    {
        return "Cart not found.";
    }

    // Sepette ilgili ürünü buluyoruz
    var cartItem = _cartRepository.GetCartItem(cart.Id, productId);

    if (cartItem == null)
    {
        return "Product not found in cart.";
    }

    // Ürünü buluyoruz ki stoğu geri ekleyelim
    var product = _productRepository.GetProductById(productId);

    if (product == null)
    {
        return "Product not found.";
    }

    // Sepetten silinen kadar stoğu geri ekliyoruz
    product.Stock += cartItem.Quantity;

    // Stok güncellemesini kaydediyoruz
    _productRepository.Update(product);

    // Cart item'ı siliyoruz
    _cartRepository.RemoveCartItem(cartItem);

    return "Product removed from cart successfully.";

}

public string UpdateCartItemQuantity(string username, int productId, int newQuantity)
{
    // Token'dan gelen username ile kullanıcıyı buluyoruz
    var user = _userRepository.GetUserByUsername(username);

    if (user == null)
    {
        return "User not found.";
    }

    // Kullanıcının sepetini buluyoruz
    var cart = _cartRepository.GetCartByUserId(user.Id);

    if (cart == null)
    {
        return "Cart not found.";
    }

    // Sepette ilgili ürünü buluyoruz
    var cartItem = _cartRepository.GetCartItem(cart.Id, productId);

    if (cartItem == null)
    {
        return "Product not found in cart.";
    }

    // Ürünün kendisini buluyoruz
    var product = _productRepository.GetProductById(productId);

    if (product == null)
    {
        return "Product not found.";
    }

    // Eski sepetteki adet
    var oldQuantity = cartItem.Quantity;

    // Eğer yeni quantity 0 ise ürünü sepetten tamamen kaldır
    if (newQuantity == 0)
    {
        // Eski miktarı stoğa geri ekle
        product.Stock += oldQuantity;
        _productRepository.Update(product);

        // Cart item'ı sil
        _cartRepository.RemoveCartItem(cartItem);

        return "Product removed from cart.";
    }

    // Yeni quantity eski quantity'den büyükse
    // Yani kullanıcı artırmak istiyor
    if (newQuantity > oldQuantity)
    {
        var difference = newQuantity - oldQuantity;

        // Yeterli stok var mı?
        if (product.Stock < difference)
        {
            return "Not enough stock.";
        }

        // Stoğu azalt
        product.Stock -= difference;
    }
    // Yeni quantity eski quantity'den küçükse
    // Yani kullanıcı azaltmak istiyor
    else if (newQuantity < oldQuantity)
    {
        var difference = oldQuantity - newQuantity;

        // Stoğu geri artır
        product.Stock += difference;
    }

    // Yeni quantity'yi cart item'a yaz
    cartItem.Quantity = newQuantity;

    // Değişiklikleri kaydet
    _productRepository.Update(product);
    _cartRepository.Save();

    return "Cart item quantity updated successfully.";
}
}