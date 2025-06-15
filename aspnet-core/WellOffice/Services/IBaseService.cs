using System.Linq.Expressions;

namespace WellOffice.Services;

public interface IBaseService<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(Guid id);
    Task<T> CreateAsync(T entity);
    Task UpdateAsync(T entity);
    Task<bool> ExistsAsync(Guid id);
} 