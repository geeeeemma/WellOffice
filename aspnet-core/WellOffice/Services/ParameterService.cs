using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Models;

namespace WellOffice.Services;

public class ParameterService : BaseService<Parameter>, IParameterService
{
    public ParameterService(WellOfficeContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Parameter>> GetParametersWithSensorsAsync()
    {
        return await _context.Parameters
            .Include(p => p.Sensors)
            .ToListAsync();
    }

    public async Task<IEnumerable<Parameter>> GetParametersWithThresholdsAsync()
    {
        return await _context.Parameters
            .Include(p => p.Thresholds)
            .ToListAsync();
    }

    public override async Task<Parameter> CreateAsync(Parameter entity)
    {
        entity.Id = Guid.NewGuid();
        return await base.CreateAsync(entity);
    }
} 