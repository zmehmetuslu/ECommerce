using ECommerceAPI.Data;
using ECommerceAPI.Entities;

namespace ECommerceAPI.Repositories;

public class ProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public List<Product> GetAllProducts()
    {
        return _context.Products.ToList();
    }
    public void AddProduct(Product product)
{
    _context.Products.Add(product);
    _context.SaveChanges();
}
public Product? GetProductById(int id)
{
    return _context.Products.FirstOrDefault(p => p.Id == id);
}
public bool DeleteProduct(int id)
    {
        var product = _context.Products.FirstOrDefault(p => p.Id == id);
        if(product == null )
        {
            return false;
        }

    _context.Products.Remove(product);
    _context.SaveChanges();

    return true;

    }

    public bool UpdateProduct(int id, Product updatedProduct)
{
    var product = _context.Products.FirstOrDefault(p => p.Id == id);

    if (product == null)
    {
        return false;
    }

    product.Name = updatedProduct.Name;
    product.Price = updatedProduct.Price;
    product.Stock = updatedProduct.Stock;
    product.ImageUrl = updatedProduct.ImageUrl;

    _context.SaveChanges();

    return true;
}

public void Update(Product product)
{
    _context.Products.Update(product);
    _context.SaveChanges();
}
}

