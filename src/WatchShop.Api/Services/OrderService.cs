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

public class OrderService : IOrderService
{
    private static readonly string[] AllowedReceiptExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxReceiptSize = 10 * 1024 * 1024;
    private const string ImagesFolder = "images";

    private readonly IBaseRepository<Order> OrderRepository;
    private readonly IBaseRepository<CartItem> CartRepository;
    private readonly IBaseRepository<User> UserRepository;
    private readonly IValidator<OrderCreateDto> OrderValidator;
    private readonly IWebHostEnvironment WebHostEnvironment;

    public OrderService(
        IBaseRepository<Order> orderRepository,
        IBaseRepository<CartItem> cartRepository,
        IBaseRepository<User> userRepository,
        IValidator<OrderCreateDto> orderValidator,
        IWebHostEnvironment webHostEnvironment)
    {
        OrderRepository = orderRepository;
        CartRepository = cartRepository;
        UserRepository = userRepository;
        OrderValidator = orderValidator;
        WebHostEnvironment = webHostEnvironment;
    }

    public async Task<long> CreateAsync(long userId, OrderCreateDto dto)
    {
        OrderValidator.Validate(dto);
        var receiptExtension = ValidateReceipt(dto.ReceiptImage);

        var user = await UserRepository.GetAllQuery()
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (user == null)
        {
            throw new NotFoundException("Foydalanuvchi topilmadi.");
        }

        if (string.IsNullOrWhiteSpace(user.Phone) || user.PhoneVerifiedAt == null)
        {
            throw new BadRequestException("Buyurtma berishdan oldin profilingizda telefon raqamingizni Telegram orqali tasdiqlang.");
        }

        var cart = await CartRepository.GetAllQuery()
            .Include(s => s.Product)
            .Where(s => s.UserId == userId)
            .ToListAsync();

        if (cart.Count == 0)
        {
            throw new BadRequestException("Savat bo'sh.");
        }

        foreach (var item in cart)
        {
            if (item.Quantity > item.Product.StockQuantity)
            {
                throw new BadRequestException($"\"{item.Product.Name}\" dan omborda faqat {item.Product.StockQuantity} ta qolgan.");
            }
        }

        var additionalPhone = string.IsNullOrWhiteSpace(dto.AdditionalPhone)
            ? null
            : dto.AdditionalPhone.Trim();

        var receiptFileName = await SaveReceiptFileAsync(dto.ReceiptImage!, receiptExtension);

        var order = new Order
        {
            UserId = userId,
            DeliveryAddress = dto.DeliveryAddress,
            Phone = user.Phone,
            AdditionalPhone = additionalPhone,
            ReceiptImageUrl = $"/{ImagesFolder}/{receiptFileName}",
            Status = OrderStatus.New,
            CreatedAt = DateTime.UtcNow
        };

        decimal totalAmount = 0;

        foreach (var item in cart)
        {
            decimal price = item.Product.CurrentPrice;

            order.Items.Add(new OrderItem
            {
                ProductId = item.ProductId,
                ProductName = item.Product.Name,
                Price = price,
                Quantity = item.Quantity
            });

            totalAmount += price * item.Quantity;

            item.Product.StockQuantity -= item.Quantity;
            CartRepository.Delete(item);
        }

        order.TotalAmount = totalAmount;

        await OrderRepository.AddAsync(order);

        await OrderRepository.SaveChangesAsync();

        return order.OrderId;
    }

    public async Task<List<OrderGetDto>> GetMineAsync(long userId)
    {
        var orders = await OrderRepository.GetAllQuery()
            .Include(b => b.User)
            .Include(b => b.Items)
                .ThenInclude(i => i.Product!.Images)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        var result = new List<OrderGetDto>();
        foreach (var order in orders)
        {
            result.Add(order.ToGetDto());
        }

        return result;
    }

    public async Task<List<OrderGetDto>> GetAllAsync()
    {
        var orders = await OrderRepository.GetAllQuery()
            .Include(b => b.User)
            .Include(b => b.Items)
                .ThenInclude(i => i.Product!.Images)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        var result = new List<OrderGetDto>();
        foreach (var order in orders)
        {
            result.Add(order.ToGetDto());
        }

        return result;
    }

    public async Task CancelAsync(long userId, long orderId)
    {
        var order = await FindAsync(orderId);

        if (order.UserId != userId)
        {
            throw new NotFoundException($"{orderId} raqamli buyurtma topilmadi.");
        }

        if (order.Status != OrderStatus.New)
        {
            throw new BadRequestException("Faqat \"Yangi\" holatdagi buyurtmani bekor qilish mumkin.");
        }

        RestoreStock(order);
        order.Status = OrderStatus.Cancelled;

        OrderRepository.Update(order);
        await OrderRepository.SaveChangesAsync();
    }

    public async Task ChangeStatusAsync(long orderId, ChangeOrderStatusDto dto)
    {
        ValidatorExtensions.ValidateEnum(dto.Status, nameof(dto.Status));

        var order = await FindAsync(orderId);

        if (order.Status == OrderStatus.Delivered || order.Status == OrderStatus.Cancelled)
        {
            throw new BadRequestException("Yakunlangan buyurtmaning holatini o'zgartirib bo'lmaydi.");
        }

        // Holat faqat oldinga yuradi: Yangi -> Tasdiqlangan -> Yetkazilgan, yoki istalgan paytda BekorQilingan
        if (dto.Status <= order.Status)
        {
            throw new BadRequestException("Buyurtma holatini faqat oldinga o'zgartirish mumkin.");
        }

        if (dto.Status == OrderStatus.Cancelled)
        {
            RestoreStock(order);
        }

        order.Status = dto.Status;

        OrderRepository.Update(order);
        await OrderRepository.SaveChangesAsync();
    }

    private async Task<Order> FindAsync(long orderId)
    {
        var order = await OrderRepository.GetAllQuery()
            .Include(b => b.Items)
                .ThenInclude(bm => bm.Product)
            .FirstOrDefaultAsync(b => b.OrderId == orderId);

        if (order == null)
        {
            throw new NotFoundException($"{orderId} raqamli buyurtma topilmadi.");
        }

        return order;
    }

    // Bekor qilingan buyurtmadagi mahsulotlar omborga qaytadi, aks holda ular "yo'qolib" qoladi
    private static void RestoreStock(Order order)
    {
        foreach (var bm in order.Items)
        {
            if (bm.Product != null)
            {
                bm.Product.StockQuantity += bm.Quantity;
            }
        }
    }

    private static string ValidateReceipt(IFormFile? receipt)
    {
        if (receipt == null || receipt.Length == 0)
        {
            throw new BadRequestException("To'lov cheki rasmini yuklang.");
        }

        if (receipt.Length > MaxReceiptSize)
        {
            throw new BadRequestException("Chek rasmi hajmi 10 MB dan oshmasligi kerak.");
        }

        var extension = Path.GetExtension(receipt.FileName).ToLowerInvariant();
        if (!AllowedReceiptExtensions.Contains(extension))
        {
            throw new BadRequestException("Faqat jpg, jpeg, png va webp formatdagi chek rasmi qabul qilinadi.");
        }

        return extension;
    }

    private async Task<string> SaveReceiptFileAsync(IFormFile receipt, string extension)
    {
        var folder = Path.Combine(WebHostEnvironment.WebRootPath, ImagesFolder);
        Directory.CreateDirectory(folder);

        var fileName = $"receipt-{Guid.NewGuid()}{extension}";
        await using var stream = new FileStream(Path.Combine(folder, fileName), FileMode.Create);
        await receipt.CopyToAsync(stream);

        return fileName;
    }
}
