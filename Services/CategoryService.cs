using ECommerceAPI.Entities;
using ECommerceAPI.Repositories;

namespace ECommerceAPI.Services;

public class CategoryService
{
    private readonly CategoryRepository _categoryRepository;

    public CategoryService(CategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public List<Category> GetAllCategories()
    {
        return _categoryRepository.GetAllCategories();
    }

    public void AddCategory(Category category)
    {
        _categoryRepository.AddCategory(category);
    }

    public Category? GetCategoryById(int id)
    {
        return _categoryRepository.GetCategoryById(id);
    }

    public bool DeleteCategory(int id)
    {
        return _categoryRepository.DeleteCategory(id);
    }
    public List<Product> GetProductsByCategoryId(int categoryId)
{
    return _categoryRepository.GetProductsByCategoryId(categoryId);
}
}









/*
BU DOSYANIN AÇIKLAMASI:

Bu service, kategori işlemlerini yönetir.
Controller'dan gelen istekleri CategoryRepository'e yönlendirir.

ÇALIŞMA MANTIĞI:
- Controller bu service'i çağırır
- Service, işlemleri repository katmanına iletir
- Veritabanından gelen sonuçları geri döndürür

YAPILAN İŞLEMLER:
- GetAllCategories → tüm kategorileri getirir
- AddCategory → yeni kategori ekler
- GetCategoryById → id'ye göre kategori getirir
- DeleteCategory → kategori siler
- GetProductsByCategoryId → kategoriye ait ürünleri getirir

BAĞLANTILI DOSYALAR:
- CategoriesController.cs → bu service'i kullanır
- CategoryRepository.cs → veritabanı işlemleri burada yapılır
- ProductsController.cs → kategoriye göre filtreleme yapar
- Admin.jsx → kategori ekleme ve silme işlemleri

NOT:
Bu service katmanında ekstra iş mantığı yoktur.
Sadece controller ile repository arasında köprü görevi görür.
*/