using WellOffice.DTOs;

namespace WellOffice.Services;

public interface IEnvironmentService
{
    Task<IEnumerable<EnvironmentDto>> GetEnvironmentsAsync();
} 