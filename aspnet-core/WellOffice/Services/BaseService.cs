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

    public virtual async Task UpdateAsync(T entity)
    {
        var existingEntity = await _dbSet.FindAsync(entity.GetType().GetProperty("Id")?.GetValue(entity));
        if (existingEntity == null)
        {
            throw new KeyNotFoundException($"Entity with ID {entity.GetType().GetProperty("Id")?.GetValue(entity)} not found");
        }

        _context.Entry(existingEntity).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
    }
} 