using Microsoft.EntityFrameworkCore;
using WellOffice.Data;

namespace WellOffice.Services;

public abstract class BaseService<T> : IBaseService<T> where T : class
{
    protected readonly WellOfficeContext _context;
    protected readonly DbSet<T> _dbSet;

    protected BaseService(WellOfficeContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<T> CreateAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<bool> ExistsAsync(Guid id)
    {
        return await _dbSet.FindAsync(id) != null;
    }
} 