using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class MahsulotRasmiConfiguration : IEntityTypeConfiguration<MahsulotRasmi>
{
    public void Configure(EntityTypeBuilder<MahsulotRasmi> builder)
    {
        builder.ToTable("MahsulotRasmlari");

        builder.HasKey(r => r.MahsulotRasmiId);

        builder.Property(r => r.RasmHavolasi)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(r => r.AsosiyRasmmi)
            .IsRequired();

        builder.HasIndex(r => r.MahsulotId);
    }
}
