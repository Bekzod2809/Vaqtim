using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;
using WatchShop.Api.Enums;

namespace WatchShop.Api.FluentApies;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(m => m.ProductId);

        builder.HasDiscriminator(m => m.Category)
            .HasValue<Watches>(Category.Watch)
            .HasValue<Glasses>(Category.Glasses)
            .HasValue<Caps>(Category.Cap)
            .HasValue<Bracelets>(Category.Bracelet)
            .HasValue<Rings>(Category.Ring);

        builder.Property(m => m.Name)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(m => m.Description)
            .HasMaxLength(2000);

        builder.Property(m => m.Brand)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.Color)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(m => m.Price)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(m => m.SalePrice)
            .HasPrecision(18, 2);

        // Ikki xaridor oxirgi mahsulotni bir vaqtda olsa, ikkinchisining saqlashi xato beradi
        builder.Property(m => m.StockQuantity)
            .IsConcurrencyToken();

        builder.Ignore(m => m.CurrentPrice);

        builder.HasIndex(m => m.Category);

        builder.HasMany(m => m.Images)
            .WithOne(r => r.Product)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
