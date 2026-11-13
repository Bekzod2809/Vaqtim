using FluentValidation;
using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Exceptions;
using WatchShop.Api.Mappings;
using WatchShop.Api.Repositories;
using WatchShop.Api.Validators;

namespace WatchShop.Api.Services;

public class CartService : ICartService
{
    private readonly IBaseRepository<CartItem> CartRepository;
    private readonly IBaseRepository<Product> ProductRepository;
    private readonly IValidator<AddToCartDto> AddValidator;
    private readonly IValidator<ChangeCartQuantityDto> QuantityValidator;

    public CartService(
        IBaseRepository<CartItem> cartRepository,
        IBaseRepository<Product> productRepository,
        IValidator<AddToCartDto> addValidator,
        IValidator<ChangeCartQuantityDto> quantityValidator)
    {
        CartRepository = cartRepository;
        ProductRepository = productRepository;
        AddValidator = addValidator;
        QuantityValidator = quantityValidator;
    }

    public async Task<CartGetDto> GetAsync(long userId)
    {
        var qatorlar = await CartRepository.GetAllQuery()
            .Include(s => s.Product)
                .ThenInclude(m => m.Images)
            .AsNoTracking()
            .Where(s => s.UserId == userId)
            .ToListAsync();

        return qatorlar.ToCartDto();
    }

    public async Task AddAsync(long userId, AddToCartDto dto)
    {
        AddValidator.Validate(dto);

        var product = await ProductRepository.GetAllQuery()
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.ProductId == dto.ProductId);

        if (product == null)
        {
            throw new NotFoundException($"{dto.ProductId} raqamli mahsulot topilmadi.");
        }

        var existingItem = await CartRepository.GetAllQuery()
            .FirstOrDefaultAsync(s => s.UserId == userId && s.ProductId == dto.ProductId);

        // Mahsulot savatda bo'lsa yangi qator ochilmaydi, soni oshiriladi
        var newQuantity = (existingItem?.Quantity ?? 0) + dto.Quantity;
        CheckStock(product, newQuantity);

        if (existingItem == null)
        {
            await CartRepository.AddAsync(new CartItem
            {
                UserId = userId,
                ProductId = dto.ProductId,
                Quantity = newQuantity
            });
        }
        else
        {
            existingItem.Quantity = newQuantity;
            CartRepository.Update(existingItem);
        }

        await CartRepository.SaveChangesAsync();
    }

    public async Task ChangeQuantityAsync(long userId, long cartItemId, ChangeCartQuantityDto dto)
    {
        QuantityValidator.Validate(dto);

        var item = await FindAsync(userId, cartItemId);
        CheckStock(item.Product, dto.Quantity);

        item.Quantity = dto.Quantity;
        CartRepository.Update(item);
        await CartRepository.SaveChangesAsync();
    }

    public async Task DeleteAsync(long userId, long cartItemId)
    {
        var item = await FindAsync(userId, cartItemId);

        CartRepository.Delete(item);
        await CartRepository.SaveChangesAsync();
    }

    // FoydalanuvchiId sharti tufayli birov boshqaning savatiga tegolmaydi: begona qator "topilmadi" bo'ladi
    private async Task<CartItem> FindAsync(long userId, long cartItemId)
    {
        var item = await CartRepository.GetAllQuery()
            .Include(s => s.Product)
            .FirstOrDefaultAsync(s => s.CartItemId == cartItemId && s.UserId == userId);

        if (item == null)
        {
            throw new NotFoundException($"Savatda {cartItemId} raqamli qator topilmadi.");
        }

        return item;
    }

    private static void CheckStock(Product product, int requiredQuantity)
    {
        if (requiredQuantity > product.StockQuantity)
        {
            throw new BadRequestException($"\"{product.Name}\" dan omborda faqat {product.StockQuantity} ta qolgan.");
        }
    }
}
