using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        builder.HasKey(b => b.OrderId);

        builder.Property(b => b.DeliveryAddress)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(b => b.Phone)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(b => b.AdditionalPhone)
            .HasMaxLength(20);

        builder.Property(b => b.TotalAmount)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(b => b.Status)
            .HasConversion<int>();

        // Bazada UTC saqlanadi; o'qiganda ham UTC ekanini belgilaymiz, aks holda JSON'da "Z" bo'lmaydi
        // va frontend vaqtni mahalliy deb o'qib, 5 soatga adashadi
        builder.Property(b => b.CreatedAt)
            .IsRequired()
            .HasConversion(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        // Foydalanuvchi o'chsa ham buyurtmalar tarixi yo'qolmasin
        builder.HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(b => b.Items)
            .WithOne(bm => bm.Order)
            .HasForeignKey(bm => bm.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(b => b.UserId);
    }
}
