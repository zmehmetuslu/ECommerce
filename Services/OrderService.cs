using ECommerceAPI.Entities;
using ECommerceAPI.Repositories;

namespace ECommerceAPI.Services;

public class OrderService
{
    private readonly OrderRepository _orderRepository;
    private readonly CartRepository _cartRepository;
    private readonly UserRepository _userRepository;

    public OrderService(
        OrderRepository orderRepository,
        CartRepository cartRepository,
        UserRepository userRepository)
    {
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
        _userRepository = userRepository;
    }

    public string CreateOrder(string username)
    {
        var user = _userRepository.GetUserByUsername(username);

        if (user == null)
        {
            return "User not found.";
        }

        var cart = _cartRepository.GetCartByUserId(user.Id);

        if (cart == null || cart.Items == null || cart.Items.Count == 0)
        {
            return "Cart is empty.";
        }

       var order = new Order
{
    UserId = user.Id,
    OrderDate = DateTime.Now,
    Status = "Pending",

    TotalPrice = cart.Items.Sum(item =>
        (item.Product != null ? item.Product.Price : 0) * item.Quantity
    ),

    Items = cart.Items.Select(item => new OrderItem
    {
        ProductId = item.ProductId,
        Quantity = item.Quantity,
        Price = item.Product != null ? item.Product.Price : 0
    }).ToList()
};
        _orderRepository.AddOrder(order);
        _cartRepository.ClearCart(cart);

        return "Order created successfully.";
    }

    public List<Order>? GetOrdersByUsername(string username)
    {
        var user = _userRepository.GetUserByUsername(username);

        if (user == null)
        {
            return null;
        }

        return _orderRepository.GetOrdersByUserId(user.Id);
    }

  public void UpdateStatus(int orderId, string status)
{
    var order = _orderRepository.GetById(orderId);

    if (order == null)
    {
        return;
    }

    order.Status = status;
    _orderRepository.Update(order);
}
}