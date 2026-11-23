using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchShop.Api.Entities;

namespace WatchShop.Api.FluentApies;

public class PaymentSettingConfiguration : IEntityTypeConfiguration<PaymentSetting>
{
    public void Configure(EntityTypeBuilder<PaymentSetting> builder)
    {
        builder.ToTable("PaymentSettings");

        builder.HasKey(x => x.PaymentSettingId);

        builder.Property(x => x.CardNumber)
            .IsRequired()
            .HasMaxLength(30);

        builder.Property(x => x.CardHolder)
            .HasMaxLength(100);

        builder.Property(x => x.UpdatedAt)
            .IsRequired();
    }
}
