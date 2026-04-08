using Microsoft.AspNetCore.Mvc;
using ECommerceAPI.Services;
using ECommerceAPI.Entities;
using ECommerceAPI.DTOs;
using System.Linq;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _productService;

    public ProductsController(ProductService productService)
    {
        _productService = productService;
    }
[HttpGet]
public IActionResult GetProducts(
    int page = 1,
    int pageSize = 5,
    string? search = null,
    int? categoryId = null,
    decimal? minPrice = null,
    decimal? maxPrice = null,
    string? sort = null)
{
    var products = _productService.GetAllProducts();

    if (!string.IsNullOrEmpty(search))
    {
        products = products
            .Where(p => p.Name.ToLower().Contains(search.ToLower()))
            .ToList();
    }
    if (categoryId.HasValue)
    {
    products = products
        .Where(p => p.CategoryId == categoryId.Value)
        .ToList();
    }

    if (minPrice.HasValue)
    {
        products = products
            .Where(p => p.Price >= minPrice.Value)
            .ToList();
    }

    if (maxPrice.HasValue)
    {
        products = products
            .Where(p => p.Price <= maxPrice.Value)
            .ToList();
    }

    if (!string.IsNullOrEmpty(sort))
    {
        if (sort == "price_asc")
        {
            products = products
                .OrderBy(p => p.Price)
                .ToList();
        }
        else if (sort == "price_desc")
        {
            products = products
                .OrderByDescending(p => p.Price)
                .ToList();
        }
    }

    var totalCount = products.Count();
    var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

    var pagedProducts = products
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToList();

    var productDtos = pagedProducts.Select(p => new ProductDto
    {
        Id = p.Id,
        Name = p.Name,
        Price = p.Price,
        Stock = p.Stock,
        ImageUrl = p.ImageUrl,
        CategoryId = p.CategoryId
    }).ToList();

    var response = new PagedResponseDto<ProductDto>
    {
        Items = productDtos,
        Page = page,
        PageSize = pageSize,
        TotalCount = totalCount,
        TotalPages = totalPages
    };

    return Ok(response);
}


  [HttpPost]
public IActionResult AddProduct(CreateProductDto dto)
{
    var product = new Product
    {
        Name = dto.Name,
        Price = dto.Price,
        Stock = dto.Stock,
        ImageUrl = dto.ImageUrl,
        CategoryId = dto.CategoryId
    };

    _productService.AddProduct(product);

    return Ok();
}
[HttpGet("{id}")]
public IActionResult GetProductById(int id)
{
    var product = _productService.GetProductById(id);

    if (product == null)
        return NotFound();

    var productDto = new ProductDto
    {
        Id = product.Id,
        Name = product.Name,
        Price = product.Price,
        Stock = product.Stock,
        ImageUrl = product.ImageUrl,
        CategoryId = product.CategoryId
    };

    return Ok(productDto);
}

[HttpDelete("{id}")]
public IActionResult DeleteProduct(int id)
    {
        var isDeleted = _productService.DeleteProduct(id);

        if(!isDeleted)
        {
            return NotFound();
        }

        return Ok();

    }

[HttpPut("{id}")]
public IActionResult UpdateProduct(int id, UpdateProductDto dto)
{
    var product = new Product
    {
        Name = dto.Name,
        Price = dto.Price,
        Stock = dto.Stock,
        ImageUrl = dto.ImageUrl,
        CategoryId = dto.CategoryId
    };

    var isUpdated = _productService.UpdateProduct(id, product);

    if (!isUpdated)
    {
        return NotFound();
    }

    return Ok();
}
}
