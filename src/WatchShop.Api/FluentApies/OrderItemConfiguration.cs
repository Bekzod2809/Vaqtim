using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems");

        builder.HasKey(bm => bm.OrderItemId);

        builder.Property(bm => bm.ProductName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(bm => bm.Price)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(bm => bm.Quantity)
            .IsRequired();

        // Mahsulot o'chirilsa buyurtma qatori qoladi, faqat bog'lanish bo'shaydi
        builder.HasOne(bm => bm.Product)
            .WithMany()
            .HasForeignKey(bm => bm.ProductId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
