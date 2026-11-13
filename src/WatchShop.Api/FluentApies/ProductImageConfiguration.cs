using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
{
    public void Configure(EntityTypeBuilder<ProductImage> builder)
    {
        builder.ToTable("ProductImages");

        builder.HasKey(r => r.ProductImageId);

        builder.Property(r => r.ImageUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(r => r.IsMainImage)
            .IsRequired();

        builder.HasIndex(r => r.ProductId);
    }
}
