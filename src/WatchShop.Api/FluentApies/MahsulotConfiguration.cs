using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;
using WatchShop.Api.Enums;

namespace WatchShop.Api.FluentApies;

public class MahsulotConfiguration : IEntityTypeConfiguration<Mahsulot>
{
    public void Configure(EntityTypeBuilder<Mahsulot> builder)
    {
        builder.ToTable("Mahsulotlar");

        builder.HasKey(m => m.MahsulotId);

        builder.HasDiscriminator(m => m.Kategoriya)
            .HasValue<Soatlar>(Kategoriya.Soat)
            .HasValue<Kozoynaklar>(Kategoriya.Kozoynak)
            .HasValue<Kepkalar>(Kategoriya.Kepka)
            .HasValue<Bilaguzuklar>(Kategoriya.Bilaguzuk)
            .HasValue<Uzuklar>(Kategoriya.Uzuk);

        builder.Property(m => m.Nomi)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(m => m.Tavsifi)
            .HasMaxLength(2000);

        builder.Property(m => m.Brendi)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.Rangi)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(m => m.Narxi)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(m => m.ChegirmaNarxi)
            .HasPrecision(18, 2);

        // Ikki xaridor oxirgi mahsulotni bir vaqtda olsa, ikkinchisining saqlashi xato beradi
        builder.Property(m => m.OmbordagiSoni)
            .IsConcurrencyToken();

        builder.Ignore(m => m.AmaldagiNarx);

        builder.HasIndex(m => m.Kategoriya);

        builder.HasMany(m => m.Rasmlari)
            .WithOne(r => r.Mahsulot)
            .HasForeignKey(r => r.MahsulotId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
