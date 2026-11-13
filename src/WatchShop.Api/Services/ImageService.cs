using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Exceptions;
using WatchShop.Api.Mappings;
using WatchShop.Api.Repositories;

namespace WatchShop.Api.Services;

public class ImageService : IImageService
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxSize = 5 * 1024 * 1024;
    private const string ImagesFolder = "images";

    private readonly IBaseRepository<Product> ProductRepository;
    private readonly IBaseRepository<ProductImage> ImageRepository;
    private readonly IWebHostEnvironment WebHostEnvironment;

    public ImageService(
        IBaseRepository<Product> productRepository,
        IBaseRepository<ProductImage> imageRepository,
        IWebHostEnvironment webHostEnvironment)
    {
        ProductRepository = productRepository;
        ImageRepository = imageRepository;
        WebHostEnvironment = webHostEnvironment;
    }

    public async Task<ProductImageGetDto> UploadAsync(long productId, ProductImageCreateDto dto)
    {
        var product = await ProductRepository.GetAllQuery()
            .Include(m => m.Images)
            .FirstOrDefaultAsync(m => m.ProductId == productId);

        if (product == null)
        {
            throw new NotFoundException($"{productId} raqamli mahsulot topilmadi.");
        }

        var extension = Validate(dto.Image);
        var fileName = await SaveFileAsync(dto.Image, extension);

        // Birinchi rasm avtomatik asosiy bo'ladi, aks holda admin belgilaydi
        var isMain = dto.IsMainImage || product.Images.Count == 0;

        if (isMain)
        {
            foreach (var oldImage in product.Images)
            {
                oldImage.IsMainImage = false;
            }
        }

        var image = new ProductImage
        {
            ProductId = productId,
            ImageUrl = $"/{ImagesFolder}/{fileName}",
            IsMainImage = isMain
        };

        await ImageRepository.AddAsync(image);
        await ImageRepository.SaveChangesAsync();

        return image.ToGetDto();
    }

    public async Task DeleteAsync(long productImageId)
    {
        var image = await ImageRepository.GetAllQuery()
            .FirstOrDefaultAsync(r => r.ProductImageId == productImageId);

        if (image == null)
        {
            throw new NotFoundException($"{productImageId} raqamli rasm topilmadi.");
        }

        RemoveFiles([image]);

        ImageRepository.Delete(image);
        await ImageRepository.SaveChangesAsync();
    }

    public void RemoveFiles(IEnumerable<ProductImage> images)
    {
        foreach (var image in images)
        {
            var filePath = Path.Combine(WebHostEnvironment.WebRootPath, ImagesFolder, Path.GetFileName(image.ImageUrl));

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }

    private static string Validate(IFormFile image)
    {
        if (image == null || image.Length == 0)
        {
            throw new BadRequestException("Rasm fayli tanlanmagan.");
        }

        if (image.Length > MaxSize)
        {
            throw new BadRequestException("Rasm hajmi 5 MB dan oshmasligi kerak.");
        }

        var extension = Path.GetExtension(image.FileName).ToLowerInvariant();

        if (!AllowedExtensions.Contains(extension))
        {
            throw new BadRequestException("Faqat jpg, jpeg, png va webp rasmlar qabul qilinadi.");
        }

        return extension;
    }

    private async Task<string> SaveFileAsync(IFormFile image, string extension)
    {
        var folder = Path.Combine(WebHostEnvironment.WebRootPath, ImagesFolder);
        Directory.CreateDirectory(folder);

        // Har bir faylga takrorlanmas nom: ikki admin bir xil nomli rasm yuklasa bir-birini o'chirmasin
        var fileName = $"{Guid.NewGuid()}{extension}";

        using var stream = new FileStream(Path.Combine(folder, fileName), FileMode.Create);
        await image.CopyToAsync(stream);

        return fileName;
    }
}
