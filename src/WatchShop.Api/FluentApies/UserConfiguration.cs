using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(f => f.UserId);

        builder.Property(f => f.FirstName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(f => f.LastName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(f => f.Email)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(f => f.Username)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(f => f.PasswordHash)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(f => f.Role)
            .HasConversion<int>();

        builder.HasIndex(f => f.Username)
            .IsUnique();

        builder.HasIndex(f => f.Email)
            .IsUnique();
    }
}
