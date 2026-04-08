using Microsoft.AspNetCore.Mvc;
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

        return Ok(categoryDtos);
    }

    [HttpPost]
    public IActionResult AddCategory(CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name
        };

        _categoryService.AddCategory(category);
        return Ok();
    }

    [HttpGet("{id}")]
    public IActionResult GetCategoryById(int id)
    {
        var category = _categoryService.GetCategoryById(id);

        if (category == null)
        {
            return NotFound();
        }

        var categoryDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        };

        return Ok(categoryDto);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCategory(int id)
    {
        var isDeleted = _categoryService.DeleteCategory(id);

        if (!isDeleted)
        {
            return NotFound();
        }

        return Ok();
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

        return Ok(result);
    }
}