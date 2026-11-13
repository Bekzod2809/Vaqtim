using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Mappings;

public static class ProductMapper
{
    public static ProductCardDto ToCardDto(this Product product)
    {
        var mainImage = product.Images.FirstOrDefault(r => r.IsMainImage)
            ?? product.Images.FirstOrDefault();

        return new ProductCardDto
        {
            ProductId = product.ProductId,
            Name = product.Name,
            Brand = product.Brand,
            Color = product.Color,
            Price = product.Price,
            SalePrice = product.SalePrice,
            StockQuantity = product.StockQuantity,
            Category = product.Category,
            MainImageUrl = mainImage?.ImageUrl
        };
    }

    public static ProductDetailsDto ToDetailsDto(this Product product)
    {
        var dto = new ProductDetailsDto
        {
            ProductId = product.ProductId,
            Name = product.Name,
            Description = product.Description,
            Brand = product.Brand,
            Color = product.Color,
            Price = product.Price,
            SalePrice = product.SalePrice,
            StockQuantity = product.StockQuantity,
            Category = product.Category,
            Images = product.Images.Select(r => r.ToGetDto()).ToList()
        };

        if (product is Watches watch)
        {
            dto.Movement = watch.Movement;
        }

        if (product is Caps cap)
        {
            dto.CapType = cap.Type;
        }

        return dto;
    }

    public static Watches ToEntity(this WatchCreateDto dto)
    {
        var watch = new Watches { Movement = dto.Movement };
        SetCommonFields(dto, watch);
        return watch;
    }

    public static Caps ToEntity(this CapCreateDto dto)
    {
        var cap = new Caps { Type = dto.Type };
        SetCommonFields(dto, cap);
        return cap;
    }

    public static Rings ToEntity(this RingCreateDto dto)
    {
        var ring = new Rings();
        SetCommonFields(dto, ring);
        return ring;
    }

    public static Bracelets ToEntity(this BraceletCreateDto dto)
    {
        var bracelet = new Bracelets();
        SetCommonFields(dto, bracelet);
        return bracelet;
    }

    public static Glasses ToEntity(this GlassesCreateDto dto)
    {
        var glasses = new Glasses();
        SetCommonFields(dto, glasses);
        return glasses;
    }

    public static void ToUpdateEntity(this WatchUpdateDto dto, Watches watch)
    {
        SetCommonFields(dto, watch);
        watch.Movement = dto.Movement;
    }

    public static void ToUpdateEntity(this CapUpdateDto dto, Caps cap)
    {
        SetCommonFields(dto, cap);
        cap.Type = dto.Type;
    }

    public static void ToUpdateEntity(this RingUpdateDto dto, Rings ring)
    {
        SetCommonFields(dto, ring);
    }

    public static void ToUpdateEntity(this BraceletUpdateDto dto, Bracelets bracelet)
    {
        SetCommonFields(dto, bracelet);
    }

    public static void ToUpdateEntity(this GlassesUpdateDto dto, Glasses glasses)
    {
        SetCommonFields(dto, glasses);
    }

    // Barcha mahsulot DTO'lari IMahsulotYozishDto dan keladi, shuning uchun umumiy maydonlar bir joyda yoziladi
    private static void SetCommonFields(IProductWriteDto dto, Product product)
    {
        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Brand = dto.Brand;
        product.Color = dto.Color;
        product.Price = dto.Price;
        product.SalePrice = dto.SalePrice;
        product.StockQuantity = dto.StockQuantity;
    }
}
