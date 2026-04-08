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