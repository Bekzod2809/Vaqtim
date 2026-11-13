using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class WatchesConfiguration : IEntityTypeConfiguration<Watches>
{
    public void Configure(EntityTypeBuilder<Watches> builder)
    {
        builder.Property(s => s.Movement)
            .HasConversion<int>();
    }
}
