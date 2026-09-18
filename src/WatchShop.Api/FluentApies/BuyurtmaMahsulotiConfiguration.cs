using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class BuyurtmaMahsulotiConfiguration : IEntityTypeConfiguration<BuyurtmaMahsuloti>
{
    public void Configure(EntityTypeBuilder<BuyurtmaMahsuloti> builder)
    {
        builder.ToTable("BuyurtmaMahsulotlari");

        builder.HasKey(bm => bm.BuyurtmaMahsulotiId);

        builder.Property(bm => bm.MahsulotNomi)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(bm => bm.Narxi)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(bm => bm.Soni)
            .IsRequired();

        // Mahsulot o'chirilsa buyurtma qatori qoladi, faqat bog'lanish bo'shaydi
        builder.HasOne(bm => bm.Mahsulot)
            .WithMany()
            .HasForeignKey(bm => bm.MahsulotId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
