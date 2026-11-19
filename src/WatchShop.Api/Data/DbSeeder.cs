using WatchShop.Api.Entities;
using WatchShop.Api.Enums;

namespace WatchShop.Api.Data;

public static class DbSeeder
{
    /// <summary>
    /// Baza bo'sh bo'lganda boshlang'ich foydalanuvchilar va mahsulotlarni qo'shadi.
    /// </summary>
    public static void Seed(AppDbContext db)
    {
        var hasChanges = false;

        if (!db.Users.Any())
        {
            db.Users.AddRange(
                new User
                {
                    FirstName = "Bekzod",
                    LastName = "Xasanov",
                    Username = "bekzodxasanov",
                    Email = "bekzodjonxasanov7@gmail.com",
                    PasswordHash = "$2a$11$LKT0CYGIps.X71J5F2I7c.ew4v9MhD5vxHTqUMuhM0xfk0.LiaY8O",
                    Role = Role.Admin
                },
                new User
                {
                    FirstName = "Ali",
                    LastName = "Aliyev",
                    Username = "ali2000",
                    Email = "aliyev7@gmail.com",
                    PasswordHash = "$2a$11$q4ULGQj3XyYBffT.aX9.huJCxH4Tz99/ZrqCH9HjDVlXg92zwLD1m",
                    Role = Role.User
                },
                new User
                {
                    FirstName = "Vali",
                    LastName = "Aliyev",
                    Username = "vali2000",
                    Email = "aliyev@gmail.com",
                    PasswordHash = "$2a$11$ACf0LSjrBGQgyAd1bLZs5uMHTYWCaa6aVa8xm2FPeaaAu6Mt98.Bu",
                    Role = Role.User
                });

            hasChanges = true;
        }

        if (!db.Products.Any())
        {
            db.Products.AddRange(
                new Watches
                {
                    Name = "Rolex",
                    Brand = "Rolex",
                    Color = "oq",
                    Price = 100000m,
                    StockQuantity = 9,
                    Movement = MovementType.Mechanical,
                    Images =
                    [
                        new ProductImage
                        {
                            ImageUrl = "/images/0a452b8c-3f60-4fc5-bb4b-990c42e5f334.png",
                            IsMainImage = true
                        }
                    ]
                },
                new Glasses
                {
                    Name = "Ko'zoynak",
                    Brand = "noname",
                    Color = "qora",
                    Price = 50000m,
                    StockQuantity = 10,
                    Images =
                    [
                        new ProductImage
                        {
                            ImageUrl = "/images/0a5c3f3f-b963-40a5-8a8c-80fcc276fcfd.png",
                            IsMainImage = true
                        }
                    ]
                },
                new Caps
                {
                    Name = "Kepka",
                    Brand = "polo",
                    Color = "qora",
                    Price = 10000m,
                    StockQuantity = 9,
                    Type = CapType.Casual,
                    Images =
                    [
                        new ProductImage
                        {
                            ImageUrl = "/images/269434d0-cd9f-40fd-b15e-76ce36b59bce.png",
                            IsMainImage = true
                        }
                    ]
                },
                new Bracelets
                {
                    Name = "nomadel",
                    Brand = "noname",
                    Color = "qora",
                    Price = 20000m,
                    StockQuantity = 9,
                    Images =
                    [
                        new ProductImage
                        {
                            ImageUrl = "/images/9bfb36bb-6f32-487c-b03d-c1ede7a2a532.png",
                            IsMainImage = true
                        }
                    ]
                },
                new Rings
                {
                    Name = "nomodel",
                    Brand = "noname",
                    Color = "tilla",
                    Price = 60000m,
                    SalePrice = 49000m,
                    StockQuantity = 10,
                    Images =
                    [
                        new ProductImage
                        {
                            ImageUrl = "/images/0ee6b5a4-7912-44f1-ba9c-54ddf8f4761f.png",
                            IsMainImage = true
                        }
                    ]
                });

            hasChanges = true;
        }

        if (hasChanges)
        {
            db.SaveChanges();
        }
    }
}
