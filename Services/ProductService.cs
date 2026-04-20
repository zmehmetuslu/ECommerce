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












/*
BU DOSYANIN AÇIKLAMASI:

Bu service, ürün işlemlerini yönetir.
Controller'dan gelen istekleri ProductRepository'e yönlendirir.

ÇALIŞMA MANTIĞI:
- Controller bu service'i çağırır
- Service, işlemleri repository katmanına iletir
- Veritabanından gelen sonuçları geri döndürür

YAPILAN İŞLEMLER:
- GetAllProducts → tüm ürünleri getirir
- AddProduct → yeni ürün ekler
- GetProductById → id'ye göre ürün getirir
- DeleteProduct → ürün siler
- UpdateProduct → ürün bilgilerini günceller

BAĞLANTILI DOSYALAR:
- ProductsController.cs → bu service'i kullanır
- ProductRepository.cs → veritabanı işlemleri burada yapılır
- Admin.jsx → ürün ekleme, silme, güncelleme
- Products.jsx → ürün listeleme

NOT:
Bu service katmanında ekstra iş mantığı bulunmaz.
Asıl veri işlemleri repository katmanında yapılır.
*/