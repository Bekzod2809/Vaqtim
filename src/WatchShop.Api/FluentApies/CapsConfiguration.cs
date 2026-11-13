using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class CapsConfiguration : IEntityTypeConfiguration<Caps>
{
    public void Configure(EntityTypeBuilder<Caps> builder)
    {
        builder.Property(k => k.Type)
            .HasConversion<int>();
    }
}
