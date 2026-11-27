using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Mappings;

public static class CartMapper
{
    public static CartItemGetDto ToGetDto(CartItem item, decimal price)
    {
        string? mainImage = null;
        foreach (var img in item.Product.Images)
        {
            if (mainImage == null || img.IsMainImage)
            {
                mainImage = img.ImageUrl;
                if (img.IsMainImage)
                {
                    break;
                }
            }
        }

        return new CartItemGetDto
        {
            CartItemId = item.CartItemId,
            ProductId = item.ProductId,
            Name = item.Product.Name,
            Price = price,
            Quantity = item.Quantity,
            Amount = price * item.Quantity,
            HasEnoughStock = item.Quantity <= item.Product.StockQuantity,
            MainImageUrl = mainImage
        };
    }
}
