using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class SoatlarConfiguration : IEntityTypeConfiguration<Soatlar>
{
    public void Configure(EntityTypeBuilder<Soatlar> builder)
    {
        builder.Property(s => s.Mexanizmi)
            .HasConversion<int>();
    }
}
