using WatchShop.Api.Data;

namespace WatchShop.Api.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : class
{
    private readonly AppDbContext DbContext;

    public BaseRepository(AppDbContext dbContext)
    {
        DbContext = dbContext;
    }

    public IQueryable<T> GetAllQuery()
    {
        return DbContext.Set<T>();
    }

    public async Task AddAsync(T t)
    {
        await DbContext.AddAsync(t);
    }

    public void Update(T t)
    {
        DbContext.Update(t);
    }

    public void Delete(T t)
    {
        DbContext.Remove(t);
    }

    public async Task SaveChangesAsync()
    {
        await DbContext.SaveChangesAsync();
    }
}
