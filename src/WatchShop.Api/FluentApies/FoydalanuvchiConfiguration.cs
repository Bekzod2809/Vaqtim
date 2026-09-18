using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class FoydalanuvchiConfiguration : IEntityTypeConfiguration<Foydalanuvchi>
{
    public void Configure(EntityTypeBuilder<Foydalanuvchi> builder)
    {
        builder.ToTable("Foydalanuvchilar");

        builder.HasKey(f => f.FoydalanuvchiId);

        builder.Property(f => f.Ism)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(f => f.Familiya)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(f => f.Email)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(f => f.Username)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(f => f.ParolHash)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(f => f.Rol)
            .HasConversion<int>();

        builder.HasIndex(f => f.Username)
            .IsUnique();

        builder.HasIndex(f => f.Email)
            .IsUnique();
    }
}
