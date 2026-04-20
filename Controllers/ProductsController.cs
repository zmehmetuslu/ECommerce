using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
    if (page < 1 || pageSize < 1)
    {
        return BadRequest(ApiResponse<object>.Fail("Sayfa ve sayfa boyutu 1 veya daha büyük olmalı."));
    }

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
        ShortDescription = p.ShortDescription,
        Unit = p.Unit,
        LowStockThreshold = p.LowStockThreshold,
        Badge = p.Badge,
        IsFeatured = p.IsFeatured,
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

    return Ok(ApiResponse<PagedResponseDto<ProductDto>>.Ok(response));
}


  [HttpPost]
[Authorize(Roles = "Admin")]
public IActionResult AddProduct(CreateProductDto dto)
{
    var product = new Product
    {
        Name = dto.Name,
        Price = dto.Price,
        Stock = dto.Stock,
        ImageUrl = dto.ImageUrl,
        ShortDescription = dto.ShortDescription,
        Unit = dto.Unit,
        LowStockThreshold = dto.LowStockThreshold,
        Badge = dto.Badge,
        IsFeatured = dto.IsFeatured,
        CategoryId = dto.CategoryId
    };

    _productService.AddProduct(product);

    return Ok(ApiResponse<object>.Ok(null, "Product added successfully."));
}
[HttpGet("{id}")]
public IActionResult GetProductById(int id)
{
    var product = _productService.GetProductById(id);

    if (product == null)
        return NotFound(ApiResponse<object>.Fail("Product not found."));

    var productDto = new ProductDto
    {
        Id = product.Id,
        Name = product.Name,
        Price = product.Price,
        Stock = product.Stock,
        ImageUrl = product.ImageUrl,
        ShortDescription = product.ShortDescription,
        Unit = product.Unit,
        LowStockThreshold = product.LowStockThreshold,
        Badge = product.Badge,
        IsFeatured = product.IsFeatured,
        CategoryId = product.CategoryId
    };

    return Ok(ApiResponse<ProductDto>.Ok(productDto));
}

[HttpDelete("{id}")]
[Authorize(Roles = "Admin")]
public IActionResult DeleteProduct(int id)
    {
        var isDeleted = _productService.DeleteProduct(id);

        if(!isDeleted)
        {
            return NotFound(ApiResponse<object>.Fail("Product not found."));
        }

        return Ok(ApiResponse<object>.Ok(null, "Product deleted successfully."));

    }

[HttpPut("{id}")]
[Authorize(Roles = "Admin")]
public IActionResult UpdateProduct(int id, UpdateProductDto dto)
{
    var product = new Product
    {
        Name = dto.Name,
        Price = dto.Price,
        Stock = dto.Stock,
        ImageUrl = dto.ImageUrl,
        ShortDescription = dto.ShortDescription,
        Unit = dto.Unit,
        LowStockThreshold = dto.LowStockThreshold,
        Badge = dto.Badge,
        IsFeatured = dto.IsFeatured,
        CategoryId = dto.CategoryId
    };

    var isUpdated = _productService.UpdateProduct(id, product);

    if (!isUpdated)
    {
        return NotFound(ApiResponse<object>.Fail("Product not found."));
    }

    return Ok(ApiResponse<object>.Ok(null, "Product updated successfully."));
}
}






















/*
BU DOSYANIN AÇIKLAMASI:

Bu controller, ürün işlemlerini yönetir.
Ürün listeleme, filtreleme, sıralama, sayfalama, ekleme, silme ve güncelleme işlemleri burada yapılır.

ÇALIŞMA MANTIĞI:
- Frontend'den gelen istekler bu controller'a gelir
- Ürünler ProductService üzerinden alınır
- Filtreleme ve sıralama işlemleri burada yapılır
- Sonuçlar DTO'ya çevrilerek frontend'e gönderilir

GET PRODUCTS (EN ÖNEMLİ KISIM):
- search → ürün adına göre arama yapar
- categoryId → kategoriye göre filtreler
- minPrice / maxPrice → fiyat aralığına göre filtreler
- sort → fiyat artan / azalan sıralama yapar
- page & pageSize → sayfalama yapar (pagination)
- Sonuçlar PagedResponseDto ile frontend'e gönderilir

DİĞER İŞLEMLER:
- AddProduct → yeni ürün ekler
- GetProductById → tek ürün getirir
- DeleteProduct → ürün siler
- UpdateProduct → ürün bilgilerini günceller

BAĞLANTILI DOSYALAR:
- ProductService.cs → ürün işlemlerinin mantığı burada
- ProductRepository.cs → veritabanı işlemleri
- Products.jsx → ürün listeleme ve filtreleme
- Home.jsx → ana sayfada ürün gösterimi
- Admin.jsx → ürün ekleme, silme, güncelleme

NOT:
Filtreleme ve sıralama işlemleri controller içinde yapılmıştır.
DTO kullanılarak ürün verileri frontend'e düzenli şekilde gönderilir.
*/
