using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Mappings;

public static class CartMapper
{
    public static CartItemGetDto ToGetDto(this CartItem item)
    {
        var mainImage = item.Product.Images.FirstOrDefault(r => r.IsMainImage)
            ?? item.Product.Images.FirstOrDefault();

        return new CartItemGetDto
        {
            CartItemId = item.CartItemId,
            ProductId = item.ProductId,
            Name = item.Product.Name,
            Price = item.Product.CurrentPrice,
            Quantity = item.Quantity,
            Amount = item.Product.CurrentPrice * item.Quantity,
            HasEnoughStock = item.Quantity <= item.Product.StockQuantity,
            MainImageUrl = mainImage?.ImageUrl
        };
    }

    public static CartGetDto ToCartDto(this List<CartItem> qatorlar)
    {
        var products = qatorlar.Select(q => q.ToGetDto()).ToList();

        return new CartGetDto
        {
            Products = products,
            TotalAmount = products.Sum(m => m.Amount)
        };
    }
}
