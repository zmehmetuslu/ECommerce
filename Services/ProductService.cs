using ECommerceAPI.Entities;
using ECommerceAPI.Repositories;

namespace ECommerceAPI.Services;

public class ProductService
{
    private readonly ProductRepository _productRepository;

    public ProductService(ProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public List<Product> GetAllProducts()
    {
        return _productRepository.GetAllProducts();
    }
    public void AddProduct(Product product)
{
    _productRepository.AddProduct(product);
}
public Product? GetProductById(int id)
{
    return _productRepository.GetProductById(id);
}

public bool DeleteProduct(int id)
    {
        return _productRepository.DeleteProduct(id);
    }
public bool UpdateProduct(int id, Product updatedProduct)
{
    return _productRepository.UpdateProduct(id, updatedProduct);
}

}