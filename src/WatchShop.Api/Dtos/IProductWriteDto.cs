namespace WatchShop.Api.Dtos;

// Mahsulot qo'shish va yangilash DTO'lari uchun umumiy maydonlar.
// Shu interfeys tufayli hamma mahsulotga bitta validator yetadi.
public interface IProductWriteDto
{
    string Name { get; set; }
    string? Description { get; set; }
    string Brand { get; set; }
    string Color { get; set; }
    decimal Price { get; set; }
    decimal? SalePrice { get; set; }
    int StockQuantity { get; set; }
}
