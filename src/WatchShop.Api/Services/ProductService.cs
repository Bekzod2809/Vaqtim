using FluentValidation;
using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Enums;
using WatchShop.Api.Exceptions;
using WatchShop.Api.Mappings;
using WatchShop.Api.Repositories;
using WatchShop.Api.Validators;

namespace WatchShop.Api.Services;

public class ProductService : IProductService
{
    private readonly IBaseRepository<Product> ProductRepository;
    private readonly IImageService ImageService;
    private readonly IValidator<IProductWriteDto> ProductValidator;

    public ProductService(
        IBaseRepository<Product> productRepository,
        IImageService imageService,
        IValidator<IProductWriteDto> productValidator)
    {
        ProductRepository = productRepository;
        ImageService = imageService;
        ProductValidator = productValidator;
    }

    public async Task<List<ProductCardDto>> GetAllAsync(Category? category, bool isAdmin)
    {
        var query = ProductRepository.GetAllQuery()
            .Include(m => m.Images)
            .AsNoTracking();

        // Tugagan mahsulot saytdan yo'qoladi, lekin admin uni ko'rib, qayta to'ldira olishi kerak
        if (!isAdmin)
        {
            query = query.Where(m => m.StockQuantity > 0);
        }

        if (category.HasValue)
        {
            query = query.Where(m => m.Category == category.Value);
        }

        var products = await query.ToListAsync();

        return products
            .Select(m => m.ToCardDto())
            .ToList();
    }

    public async Task<List<ProductCardDto>> GetSalesAsync()
    {
        var products = await ProductRepository.GetAllQuery()
            .Include(m => m.Images)
            .AsNoTracking()
            .Where(m => m.SalePrice != null && m.StockQuantity > 0)
            .ToListAsync();

        return products
            .Select(m => m.ToCardDto())
            .ToList();
    }

    public async Task<ProductDetailsDto> GetByIdAsync(long productId)
    {
        var product = await ProductRepository.GetAllQuery()
            .Include(m => m.Images)
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.ProductId == productId);

        if (product == null)
        {
            throw new NotFoundException($"{productId} raqamli mahsulot topilmadi.");
        }

        return product.ToDetailsDto();
    }

    public async Task<long> CreateWatchAsync(WatchCreateDto dto)
    {
        ProductValidator.Validate(dto);
        ValidatorExtensions.ValidateEnum(dto.Movement, nameof(dto.Movement));
        return await AddAsync(dto.ToEntity());
    }

    public async Task<long> CreateCapAsync(CapCreateDto dto)
    {
        ProductValidator.Validate(dto);
        ValidatorExtensions.ValidateEnum(dto.Type, nameof(dto.Type));
        return await AddAsync(dto.ToEntity());
    }

    public async Task<long> CreateRingAsync(RingCreateDto dto)
    {
        ProductValidator.Validate(dto);
        return await AddAsync(dto.ToEntity());
    }

    public async Task<long> CreateBraceletAsync(BraceletCreateDto dto)
    {
        ProductValidator.Validate(dto);
        return await AddAsync(dto.ToEntity());
    }

    public async Task<long> CreateGlassesAsync(GlassesCreateDto dto)
    {
        ProductValidator.Validate(dto);
        return await AddAsync(dto.ToEntity());
    }

    public async Task UpdateWatchAsync(long productId, WatchUpdateDto dto)
    {
        ProductValidator.Validate(dto);
        ValidatorExtensions.ValidateEnum(dto.Movement, nameof(dto.Movement));

        var watch = await FindAsync<Watches>(productId);
        dto.ToUpdateEntity(watch);
        await SaveAsync(watch);
    }

    public async Task UpdateCapAsync(long productId, CapUpdateDto dto)
    {
        ProductValidator.Validate(dto);
        ValidatorExtensions.ValidateEnum(dto.Type, nameof(dto.Type));

        var cap = await FindAsync<Caps>(productId);
        dto.ToUpdateEntity(cap);
        await SaveAsync(cap);
    }

    public async Task UpdateRingAsync(long productId, RingUpdateDto dto)
    {
        ProductValidator.Validate(dto);

        var ring = await FindAsync<Rings>(productId);
        dto.ToUpdateEntity(ring);
        await SaveAsync(ring);
    }

    public async Task UpdateBraceletAsync(long productId, BraceletUpdateDto dto)
    {
        ProductValidator.Validate(dto);

        var bracelet = await FindAsync<Bracelets>(productId);
        dto.ToUpdateEntity(bracelet);
        await SaveAsync(bracelet);
    }

    public async Task UpdateGlassesAsync(long productId, GlassesUpdateDto dto)
    {
        ProductValidator.Validate(dto);

        var glasses = await FindAsync<Glasses>(productId);
        dto.ToUpdateEntity(glasses);
        await SaveAsync(glasses);
    }

    public async Task DeleteAsync(long productId)
    {
        var product = await ProductRepository.GetAllQuery()
            .Include(m => m.Images)
            .FirstOrDefaultAsync(m => m.ProductId == productId);

        if (product == null)
        {
            throw new NotFoundException($"{productId} raqamli mahsulot topilmadi.");
        }

        // Bazadagi qatorlar cascade bilan o'chadi, fayllarni o'zimiz o'chiramiz
        ImageService.RemoveFiles(product.Images);

        ProductRepository.Delete(product);
        await ProductRepository.SaveChangesAsync();
    }

    private async Task<long> AddAsync(Product product)
    {
        await ProductRepository.AddAsync(product);
        await ProductRepository.SaveChangesAsync();

        return product.ProductId;
    }

    private async Task<T> FindAsync<T>(long productId) where T : Product
    {
        var product = await ProductRepository.GetAllQuery()
            .OfType<T>()
            .FirstOrDefaultAsync(m => m.ProductId == productId);

        if (product == null)
        {
            throw new NotFoundException($"{productId} raqamli mahsulot topilmadi.");
        }

        return product;
    }

    private async Task SaveAsync(Product product)
    {
        ProductRepository.Update(product);
        await ProductRepository.SaveChangesAsync();
    }
}
