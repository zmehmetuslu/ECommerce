using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ECommerceAPI.Entities;
using ECommerceAPI.Services;
using ECommerceAPI.DTOs;
using System.Linq;


namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoriesController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public IActionResult GetCategories()
    {
        var categories = _categoryService.GetAllCategories();

        var categoryDtos = categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name
        }).ToList();

        return Ok(ApiResponse<List<CategoryDto>>.Ok(categoryDtos));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult AddCategory(CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name
        };

        _categoryService.AddCategory(category);
        return Ok(ApiResponse<object>.Ok(null, "Category added successfully."));
    }

    [HttpGet("{id}")]
    public IActionResult GetCategoryById(int id)
    {
        var category = _categoryService.GetCategoryById(id);

        if (category == null)
        {
            return NotFound(ApiResponse<object>.Fail("Category not found."));
        }

        var categoryDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        };

        return Ok(ApiResponse<CategoryDto>.Ok(categoryDto));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteCategory(int id)
    {
        var isDeleted = _categoryService.DeleteCategory(id);

        if (!isDeleted)
        {
            return NotFound(ApiResponse<object>.Fail("Category not found."));
        }

        return Ok(ApiResponse<object>.Ok(null, "Category deleted successfully."));
    }

   [HttpGet("{id}/products")]
    public IActionResult GetProductsByCategory(int id)
    {
        var products = _categoryService.GetProductsByCategoryId(id);

        var result = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price,
            Stock = p.Stock,
            ImageUrl = p.ImageUrl,
            CategoryId = p.CategoryId
        }).ToList();

        return Ok(ApiResponse<List<ProductDto>>.Ok(result));
    }
}





/*
BU DOSYANIN AÇIKLAMASI:

Bu controller, kategori işlemlerini yönetir.
Kategorileri listeleme, ekleme, silme ve kategoriye göre ürün getirme işlemleri burada yapılır.

ÇALIŞMA MANTIĞI:
- Frontend'den gelen istekler bu controller'a gelir
- İlgili işlemler CategoryService'e gönderilir
- Veritabanından alınan veriler DTO'ya çevrilerek frontend'e gönderilir

YAPILAN İŞLEMLER:
- GetCategories → tüm kategorileri listeler
- AddCategory → yeni kategori ekler
- GetCategoryById → id'ye göre kategori getirir
- DeleteCategory → kategori siler
- GetProductsByCategory → seçilen kategoriye ait ürünleri getirir

BAĞLANTILI DOSYALAR:
- CategoryService.cs → kategori işlemlerinin mantığı burada
- CategoryRepository.cs → veritabanı işlemleri
- ProductRepository.cs → kategoriye ait ürünleri getirir
- Products.jsx → frontend filtreleme kısmında kullanılır
- Admin.jsx → kategori ekleme ve silme işlemleri

NOT:
Controller sadece istekleri yönlendirir, asıl işlemler service katmanında yapılır.
DTO kullanımı ile veriler düzenli şekilde frontend'e gönderilir.
*/