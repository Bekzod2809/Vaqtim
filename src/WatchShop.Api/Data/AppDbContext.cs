using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Data;

public class AppDbContext : DbContext
{
    public DbSet<Mahsulot> Mahsulotlar { get; set; }
    public DbSet<MahsulotRasmi> MahsulotRasmlari { get; set; }
    public DbSet<Foydalanuvchi> Foydalanuvchilar { get; set; }
    public DbSet<SavatMahsuloti> SavatMahsulotlari { get; set; }
    public DbSet<Buyurtma> Buyurtmalar { get; set; }
    public DbSet<BuyurtmaMahsuloti> BuyurtmaMahsulotlari { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AppDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}
