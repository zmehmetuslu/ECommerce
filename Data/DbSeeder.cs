using ECommerceAPI.Entities;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace ECommerceAPI.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.EnsureCreatedAsync();
        await EnsureProductCatalogColumnsAsync(context);
        await EnsureOrderPaymentColumnsAsync(context);
        await EnsureOrderStatusLogTableAsync(context);
        await EnsureWishlistTableAsync(context);
        await EnsureProductReviewsTableAsync(context);
        await EnsureReviewHelpfulVotesTableAsync(context);
        await EnsureCouponTableAsync(context);
        await EnsureCouponUsageTableAsync(context);
        await NormalizeAndCleanExistingDataAsync(context);

        var categoryNames = new[]
        {
            "Tohum",
            "Gubre",
            "Tarim Ilaci",
            "Sulama",
            "Ekipman",
            "Bahce Aletleri",
            "Fide"
        };

        var existingCategories = await context.Categories.ToListAsync();
        var existingCategorySet = existingCategories
            .Select(c => c.Name)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var missingCategories = categoryNames
            .Where(name => !existingCategorySet.Contains(name))
            .Select(name => new Category { Name = name })
            .ToList();

        if (missingCategories.Count > 0)
        {
            await context.Categories.AddRangeAsync(missingCategories);
            await context.SaveChangesAsync();
        }

        var categoryMap = (await context.Categories.ToListAsync())
            .GroupBy(c => c.Name, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                g => g.Key,
                g => g.First().Id,
                StringComparer.OrdinalIgnoreCase
            );

        var catalog = new List<ProductSeedItem>
        {
            new("Domates Tohumu Hibrit 10gr", 249, 140, "Tohum", "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=900&q=80"),
            new("Biber Tohumu Tatli 10gr", 229, 130, "Tohum", "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80"),
            new("Salatalik Tohumu 10gr", 199, 150, "Tohum", "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80"),
            new("Bugday Tohumu Sertifikali 25kg", 890, 60, "Tohum", "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80"),
            new("Arpa Tohumu 25kg", 780, 55, "Tohum", "https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&w=900&q=80"),

            new("NPK 20-20-20 Gubre 10kg", 520, 95, "Gubre", "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=900&q=80"),
            new("Organik Solucan Gubresi 5kg", 320, 110, "Gubre", "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80"),
            new("Amonyum Nitrat 26kg", 690, 70, "Gubre", "https://images.unsplash.com/photo-1591635220662-6b11f1703bd9?auto=format&fit=crop&w=900&q=80"),
            new("Mikro Besin Karisimi 1kg", 280, 80, "Gubre", "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=900&q=80"),
            new("Damla Sulama Ozel Gubresi 20kg", 760, 65, "Gubre", "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80"),

            new("Yabanci Ot Ilaci 1L", 360, 75, "Tarim Ilaci", "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80"),
            new("Mantar Ilaci 500ml", 280, 85, "Tarim Ilaci", "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80"),
            new("Bocek Ilaci 1L", 315, 90, "Tarim Ilaci", "https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&w=900&q=80"),
            new("Yaprak Biti Spreyi 250ml", 190, 100, "Tarim Ilaci", "https://images.unsplash.com/photo-1598515213692-5f252f75d785?auto=format&fit=crop&w=900&q=80"),
            new("Biyolojik Koruma Seti", 540, 45, "Tarim Ilaci", "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80"),

            new("Damla Sulama Seti 100m", 1290, 35, "Sulama", "https://images.unsplash.com/photo-1592982537447-6f2a6a0f0f9b?auto=format&fit=crop&w=900&q=80"),
            new("Sulama Zamanlayici Dijital", 990, 40, "Sulama", "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=900&q=80"),
            new("Bahce Hortumu 50m", 460, 80, "Sulama", "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80"),
            new("Mini Yagmurlama Basligi 10lu", 210, 120, "Sulama", "https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&w=900&q=80"),
            new("Su Motoru 2HP", 3890, 18, "Sulama", "https://images.unsplash.com/photo-1581091215367-59ab6dcef5f8?auto=format&fit=crop&w=900&q=80"),

            new("Akulu Sirt Pompasi 16L", 2250, 28, "Ekipman", "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80"),
            new("Budama Makasi Profesyonel", 410, 110, "Ekipman", "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80"),
            new("Motorlu Tirpan 52cc", 4650, 22, "Ekipman", "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80"),
            new("Mini Capalama Makinesi", 5390, 16, "Ekipman", "https://images.unsplash.com/photo-1591635220662-6b11f1703bd9?auto=format&fit=crop&w=900&q=80"),
            new("Hasat Bicagi Paslanmaz", 175, 150, "Ekipman", "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=900&q=80"),

            new("Kurek Celik Sapli", 280, 90, "Bahce Aletleri", "https://images.unsplash.com/photo-1615486363727-5a6ca99efafe?auto=format&fit=crop&w=900&q=80"),
            new("Capa Kucuk Boy", 220, 105, "Bahce Aletleri", "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80"),
            new("Tirmik 16 Dis", 195, 98, "Bahce Aletleri", "https://images.unsplash.com/photo-1598515213692-5f252f75d785?auto=format&fit=crop&w=900&q=80"),
            new("Budama Testeresi", 340, 76, "Bahce Aletleri", "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80"),
            new("Bahce Eldiveni 3lu", 150, 170, "Bahce Aletleri", "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80"),

            new("Domates Fidesi 10lu Paket", 280, 120, "Fide", "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80"),
            new("Biber Fidesi 10lu Paket", 260, 110, "Fide", "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80"),
            new("Patlican Fidesi 10lu Paket", 270, 100, "Fide", "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80"),
            new("Salatalik Fidesi 10lu Paket", 250, 115, "Fide", "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=900&q=80"),
            new("Marul Fidesi 20li Viyol", 240, 125, "Fide", "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80")
        };

        var existingProductNames = await context.Products
            .Select(p => p.Name)
            .ToListAsync();
        var existingProductSet = existingProductNames.ToHashSet(StringComparer.OrdinalIgnoreCase);

        var productsToInsert = catalog
            .Where(item => !existingProductSet.Contains(item.Name))
            .Select(item => new Product
            {
                Name = item.Name,
                Price = item.Price,
                Stock = item.Stock,
                ImageUrl = item.ImageUrl,
                ShortDescription = BuildShortDescription(item.Name, item.CategoryName),
                Unit = InferUnit(item.Name),
                LowStockThreshold = InferLowStockThreshold(item.Price),
                Badge = InferBadge(item.Price),
                IsFeatured = InferFeatured(item.Price, item.Name),
                CategoryId = categoryMap[item.CategoryName]
            })
            .ToList();

        if (productsToInsert.Count > 0)
        {
            await context.Products.AddRangeAsync(productsToInsert);
            await context.SaveChangesAsync();
        }
    }

    private static async Task EnsureOrderStatusLogTableAsync(AppDbContext context)
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS "OrderStatusLogs" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_OrderStatusLogs" PRIMARY KEY AUTOINCREMENT,
                "OrderId" INTEGER NOT NULL,
                "OldStatus" TEXT NOT NULL,
                "NewStatus" TEXT NOT NULL,
                "ChangedBy" TEXT NOT NULL,
                "ChangedAt" TEXT NOT NULL
            );
            """;
        await context.Database.ExecuteSqlRawAsync(sql);
    }

    private static async Task EnsureOrderPaymentColumnsAsync(AppDbContext context)
    {
        await TryAddOrderColumnAsync(context, "PaymentStatus");
        await TryAddOrderColumnAsync(context, "PaymentMethod");
        await TryAddOrderColumnAsync(context, "PaymentReference");
        await TryAddOrderColumnAsync(context, "PaymentUpdatedAt");
    }

    private static async Task EnsureProductCatalogColumnsAsync(AppDbContext context)
    {
        await TryAddProductColumnAsync(context, "ShortDescription");
        await TryAddProductColumnAsync(context, "Unit");
        await TryAddProductColumnAsync(context, "LowStockThreshold");
        await TryAddProductColumnAsync(context, "Badge");
        await TryAddProductColumnAsync(context, "IsFeatured");
    }

    private static async Task TryAddProductColumnAsync(AppDbContext context, string name)
    {
        if (await ColumnExistsAsync(context, "Products", name))
        {
            return;
        }

        string? sql = name switch
        {
            "ShortDescription" => "ALTER TABLE \"Products\" ADD COLUMN \"ShortDescription\" TEXT NOT NULL DEFAULT '';",
            "Unit" => "ALTER TABLE \"Products\" ADD COLUMN \"Unit\" TEXT NOT NULL DEFAULT 'Adet';",
            "LowStockThreshold" => "ALTER TABLE \"Products\" ADD COLUMN \"LowStockThreshold\" INTEGER NOT NULL DEFAULT 5;",
            "Badge" => "ALTER TABLE \"Products\" ADD COLUMN \"Badge\" TEXT NOT NULL DEFAULT '';",
            "IsFeatured" => "ALTER TABLE \"Products\" ADD COLUMN \"IsFeatured\" INTEGER NOT NULL DEFAULT 0;",
            _ => null
        };
        if (sql == null) return;

        try
        {
            await context.Database.ExecuteSqlRawAsync(sql);
        }
        catch
        {
            // Column already exists
        }
    }

    private static async Task TryAddOrderColumnAsync(AppDbContext context, string name)
    {
        if (await ColumnExistsAsync(context, "Orders", name))
        {
            return;
        }

        string? sql = name switch
        {
            "PaymentStatus" => "ALTER TABLE \"Orders\" ADD COLUMN \"PaymentStatus\" TEXT NOT NULL DEFAULT 'Pending';",
            "PaymentMethod" => "ALTER TABLE \"Orders\" ADD COLUMN \"PaymentMethod\" TEXT NOT NULL DEFAULT 'Kapida Odeme';",
            "PaymentReference" => "ALTER TABLE \"Orders\" ADD COLUMN \"PaymentReference\" TEXT NULL;",
            "PaymentUpdatedAt" => "ALTER TABLE \"Orders\" ADD COLUMN \"PaymentUpdatedAt\" TEXT NULL;",
            _ => null
        };
        if (sql == null) return;

        try
        {
            await context.Database.ExecuteSqlRawAsync(sql);
        }
        catch
        {
            // Column already exists
        }
    }

    private static async Task EnsureWishlistTableAsync(AppDbContext context)
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS "WishlistItems" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_WishlistItems" PRIMARY KEY AUTOINCREMENT,
                "UserId" INTEGER NOT NULL,
                "ProductId" INTEGER NOT NULL,
                "CreatedAt" TEXT NOT NULL
            );
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_WishlistItems_UserId_ProductId"
            ON "WishlistItems" ("UserId", "ProductId");
            """;
        await context.Database.ExecuteSqlRawAsync(sql);
    }

    private static async Task EnsureProductReviewsTableAsync(AppDbContext context)
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS "ProductReviews" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_ProductReviews" PRIMARY KEY AUTOINCREMENT,
                "ProductId" INTEGER NOT NULL,
                "UserId" INTEGER NOT NULL,
                "Rating" INTEGER NOT NULL,
                "Comment" TEXT NOT NULL,
                "HelpfulCount" INTEGER NOT NULL DEFAULT 0,
                "IsVisible" INTEGER NOT NULL DEFAULT 1,
                "CreatedAt" TEXT NOT NULL
            );
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_ProductReviews_ProductId_UserId"
            ON "ProductReviews" ("ProductId", "UserId");
            CREATE INDEX IF NOT EXISTS "IX_ProductReviews_ProductId"
            ON "ProductReviews" ("ProductId");
            """;
        await context.Database.ExecuteSqlRawAsync(sql);
        if (!await ColumnExistsAsync(context, "ProductReviews", "IsVisible"))
        {
            await context.Database.ExecuteSqlRawAsync(
                "ALTER TABLE \"ProductReviews\" ADD COLUMN \"IsVisible\" INTEGER NOT NULL DEFAULT 1;");
        }
        if (!await ColumnExistsAsync(context, "ProductReviews", "HelpfulCount"))
        {
            await context.Database.ExecuteSqlRawAsync(
                "ALTER TABLE \"ProductReviews\" ADD COLUMN \"HelpfulCount\" INTEGER NOT NULL DEFAULT 0;");
        }
    }

    private static async Task EnsureReviewHelpfulVotesTableAsync(AppDbContext context)
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS "ReviewHelpfulVotes" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_ReviewHelpfulVotes" PRIMARY KEY AUTOINCREMENT,
                "ReviewId" INTEGER NOT NULL,
                "UserId" INTEGER NOT NULL,
                "CreatedAt" TEXT NOT NULL
            );
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_ReviewHelpfulVotes_ReviewId_UserId"
            ON "ReviewHelpfulVotes" ("ReviewId", "UserId");
            """;
        await context.Database.ExecuteSqlRawAsync(sql);
    }

    private static async Task EnsureCouponTableAsync(AppDbContext context)
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS "Coupons" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_Coupons" PRIMARY KEY AUTOINCREMENT,
                "Code" TEXT NOT NULL,
                "Type" TEXT NOT NULL,
                "Value" TEXT NOT NULL,
                "MinTotal" TEXT NOT NULL,
                "IsActive" INTEGER NOT NULL,
                "ExpireAt" TEXT NULL,
                "UsageLimit" INTEGER NULL,
                "UsedCount" INTEGER NOT NULL DEFAULT 0,
                "PerUserLimit" INTEGER NOT NULL DEFAULT 1
            );
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_Coupons_Code"
            ON "Coupons" ("Code");
            """;
        await context.Database.ExecuteSqlRawAsync(sql);
        await TryAddCouponColumnAsync(context, "UsageLimit");
        await TryAddCouponColumnAsync(context, "UsedCount");
        await TryAddCouponColumnAsync(context, "PerUserLimit");

        var coupons = new List<(string Code, string Type, decimal Value, decimal MinTotal, int? UsageLimit, int PerUserLimit)>
        {
            ("HOSGELDIN10", "rate", 10m, 300m, 500, 1),
            ("TARIM50", "fixed", 50m, 500m, 300, 1),
            ("KARGO0", "free_shipping", 0m, 700m, 300, 1)
        };

        foreach (var coupon in coupons)
        {
            var existing = await context.Coupons.FirstOrDefaultAsync(c => c.Code == coupon.Code);
            if (existing == null)
            {
                context.Coupons.Add(new Coupon
                {
                    Code = coupon.Code,
                    Type = coupon.Type,
                    Value = coupon.Value,
                    MinTotal = coupon.MinTotal,
                    IsActive = true,
                    UsageLimit = coupon.UsageLimit,
                    PerUserLimit = coupon.PerUserLimit,
                    ExpireAt = DateTime.UtcNow.AddMonths(6)
                });
                continue;
            }

            existing.Type = coupon.Type;
            existing.Value = coupon.Value;
            existing.MinTotal = coupon.MinTotal;
            existing.IsActive = true;
            existing.UsageLimit = coupon.UsageLimit;
            existing.PerUserLimit = coupon.PerUserLimit;
            existing.ExpireAt ??= DateTime.UtcNow.AddMonths(6);
        }

        await context.SaveChangesAsync();
    }

    private static async Task EnsureCouponUsageTableAsync(AppDbContext context)
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS "CouponUsages" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_CouponUsages" PRIMARY KEY AUTOINCREMENT,
                "CouponId" INTEGER NOT NULL,
                "UserId" INTEGER NOT NULL,
                "UsedAt" TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS "IX_CouponUsages_CouponId_UserId"
            ON "CouponUsages" ("CouponId", "UserId");
            """;
        await context.Database.ExecuteSqlRawAsync(sql);
    }

    private static async Task TryAddCouponColumnAsync(AppDbContext context, string columnName)
    {
        if (await ColumnExistsAsync(context, "Coupons", columnName))
        {
            return;
        }

        string? sql = columnName switch
        {
            "UsageLimit" => "ALTER TABLE \"Coupons\" ADD COLUMN \"UsageLimit\" INTEGER NULL;",
            "UsedCount" => "ALTER TABLE \"Coupons\" ADD COLUMN \"UsedCount\" INTEGER NOT NULL DEFAULT 0;",
            "PerUserLimit" => "ALTER TABLE \"Coupons\" ADD COLUMN \"PerUserLimit\" INTEGER NOT NULL DEFAULT 1;",
            _ => null
        };
        if (sql == null) return;

        try
        {
            await context.Database.ExecuteSqlRawAsync(sql);
        }
        catch
        {
            // Column already exists
        }
    }

    private static async Task<bool> ColumnExistsAsync(AppDbContext context, string tableName, string columnName)
    {
        await using var connection = context.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
        {
            await connection.OpenAsync();
        }

        await using var command = connection.CreateCommand();
        command.CommandText = $"PRAGMA table_info(\"{tableName}\");";

        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var currentName = reader["name"]?.ToString();
            if (string.Equals(currentName, columnName, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }

    private static async Task NormalizeAndCleanExistingDataAsync(AppDbContext context)
    {
        var categories = await context.Categories
            .OrderBy(c => c.Id)
            .ToListAsync();

        foreach (var category in categories)
        {
            category.Name = category.Name.Trim();
            if (string.Equals(category.Name, "string", StringComparison.OrdinalIgnoreCase))
            {
                category.Name = "Genel";
            }
            if (string.Equals(category.Name, "tahil", StringComparison.OrdinalIgnoreCase))
            {
                category.Name = "Tahil";
            }
            if (string.Equals(category.Name, "sebze", StringComparison.OrdinalIgnoreCase))
            {
                category.Name = "Sebze";
            }
        }
        await context.SaveChangesAsync();

        categories = await context.Categories
            .OrderBy(c => c.Id)
            .ToListAsync();

        var duplicateGroups = categories
            .GroupBy(c => c.Name, StringComparer.OrdinalIgnoreCase)
            .Where(g => g.Count() > 1);

        foreach (var group in duplicateGroups)
        {
            var primary = group.First();
            var duplicates = group.Skip(1).ToList();
            var duplicateIds = duplicates.Select(c => c.Id).ToList();

            var products = await context.Products
                .Where(p => duplicateIds.Contains(p.CategoryId))
                .ToListAsync();
            foreach (var product in products)
            {
                product.CategoryId = primary.Id;
            }

            context.Categories.RemoveRange(duplicates);
        }

        var dirtyNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "a", "aa", "x", "ee", "ea", "test", "string"
        };
        var dirtyProducts = await context.Products
            .Where(p => p.Name.Length <= 2 || dirtyNames.Contains(p.Name))
            .ToListAsync();
        if (dirtyProducts.Count > 0)
        {
            context.Products.RemoveRange(dirtyProducts);
        }

        await context.SaveChangesAsync();
    }

    private sealed record ProductSeedItem(
        string Name,
        decimal Price,
        int Stock,
        string CategoryName,
        string ImageUrl
    );

    private static string BuildShortDescription(string productName, string categoryName)
    {
        return $"{categoryName} kategorisinde profesyonel kullanım için uygun {productName.ToLowerInvariant()} ürünü.";
    }

    private static string InferUnit(string productName)
    {
        var lower = productName.ToLowerInvariant();
        if (productName.Contains("kg", StringComparison.OrdinalIgnoreCase))
            return "kg";
        if (lower.Contains(" ml") || lower.Contains(" l") || lower.EndsWith("l"))
            return "L";
        if (productName.Contains("Paket", StringComparison.OrdinalIgnoreCase))
            return "Paket";
        return "Adet";
    }

    private static int InferLowStockThreshold(decimal price)
    {
        if (price >= 3000) return 5;
        if (price >= 1000) return 8;
        return 12;
    }

    private static string InferBadge(decimal price)
    {
        if (price >= 3000) return "Premium";
        if (price >= 1000) return "Profesyonel";
        return "Yeni";
    }

    private static bool InferFeatured(decimal price, string name)
    {
        if (price >= 3000) return true;
        if (name.Contains("Profesyonel", StringComparison.OrdinalIgnoreCase)) return true;
        return false;
    }
}
