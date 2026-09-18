using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class SavatMahsulotiConfiguration : IEntityTypeConfiguration<SavatMahsuloti>
{
    public void Configure(EntityTypeBuilder<SavatMahsuloti> builder)
    {
        builder.ToTable("SavatMahsulotlari");

        builder.HasKey(s => s.SavatMahsulotiId);

        builder.Property(s => s.Soni)
            .IsRequired();

        builder.HasOne(s => s.Foydalanuvchi)
            .WithMany()
            .HasForeignKey(s => s.FoydalanuvchiId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(s => s.Mahsulot)
            .WithMany()
            .HasForeignKey(s => s.MahsulotId)
            .OnDelete(DeleteBehavior.Cascade);

        // Bitta foydalanuvchi savatida bitta mahsulot faqat bir qator bo'ladi, sonini oshiramiz
        builder.HasIndex(s => new { s.FoydalanuvchiId, s.MahsulotId })
            .IsUnique();
    }
}
