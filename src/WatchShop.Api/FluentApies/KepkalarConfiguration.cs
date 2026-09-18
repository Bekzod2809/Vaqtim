using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class KepkalarConfiguration : IEntityTypeConfiguration<Kepkalar>
{
    public void Configure(EntityTypeBuilder<Kepkalar> builder)
    {
        builder.Property(k => k.Turi)
            .HasConversion<int>();
    }
}
