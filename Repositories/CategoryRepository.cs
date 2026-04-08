using ECommerceAPI.Data;
using ECommerceAPI.Entities;

namespace ECommerceAPI.Repositories;

public class CategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public List<Category> GetAllCategories()
    {
        return _context.Categories.ToList();
    }

    public void AddCategory(Category category)
    {
        _context.Categories.Add(category);
        _context.SaveChanges();
    }

    public Category? GetCategoryById(int id)
    {
        return _context.Categories.FirstOrDefault(c => c.Id == id);
    }

    public bool DeleteCategory(int id)
    {
        var category = _context.Categories.FirstOrDefault(c => c.Id == id);

        if (category == null)
        {
            return false;
        }

        _context.Categories.Remove(category);
        _context.SaveChanges();

        return true;
    }
    public List<Product> GetProductsByCategoryId(int categoryId)
{
    return _context.Products
        .Where(p => p.CategoryId == categoryId)
        .ToList();
}
}