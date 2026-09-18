using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class BuyurtmaConfiguration : IEntityTypeConfiguration<Buyurtma>
{
    public void Configure(EntityTypeBuilder<Buyurtma> builder)
    {
        builder.ToTable("Buyurtmalar");

        builder.HasKey(b => b.BuyurtmaId);

        builder.Property(b => b.YetkazishManzili)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(b => b.Telefon)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(b => b.JamiSumma)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(b => b.Holati)
            .HasConversion<int>();

        // Bazada UTC saqlanadi; o'qiganda ham UTC ekanini belgilaymiz, aks holda JSON'da "Z" bo'lmaydi
        // va frontend vaqtni mahalliy deb o'qib, 5 soatga adashadi
        builder.Property(b => b.YaratilganVaqt)
            .IsRequired()
            .HasConversion(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        // Foydalanuvchi o'chsa ham buyurtmalar tarixi yo'qolmasin
        builder.HasOne(b => b.Foydalanuvchi)
            .WithMany()
            .HasForeignKey(b => b.FoydalanuvchiId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(b => b.Mahsulotlari)
            .WithOne(bm => bm.Buyurtma)
            .HasForeignKey(bm => bm.BuyurtmaId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(b => b.FoydalanuvchiId);
    }
}
