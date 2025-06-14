using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Models;

namespace WellOffice.Services;

public class RemediationActionService : BaseService<RemediationAction>, IRemediationActionService
{
    public RemediationActionService(WellOfficeContext context) : base(context)
    {
    }

    public async Task<IEnumerable<RemediationAction>> GetRemediationActionsBySensorAsync(Guid sensorId)
    {
        return await _context.RemediationActions
            .Include(ra => ra.Sensor)
            .Where(ra => ra.SensorId == sensorId)
            .OrderByDescending(ra => ra.ActionDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<RemediationAction>> GetLatestRemediationActionsAsync(Guid sensorId, int count = 10)
    {
        return await _context.RemediationActions
            .Include(ra => ra.Sensor)
            .Where(ra => ra.SensorId == sensorId)
            .OrderByDescending(ra => ra.ActionDate)
            .Take(count)
            .ToListAsync();
    }

    public async Task<RemediationAction> CreateRemediationActionAsync(RemediationAction action, bool validateSensor = true)
    {
        if (validateSensor)
        {
            var sensor = await _context.Sensors.FindAsync(action.SensorId);
            if (sensor == null)
            {
                throw new InvalidOperationException("Sensor not found");
            }
        }

        action.Id = Guid.NewGuid();
        action.ActionDate = DateTime.UtcNow;
        return await base.CreateAsync(action);
    }

    public override async Task<RemediationAction> CreateAsync(RemediationAction entity)
    {
        return await CreateRemediationActionAsync(entity);
    }
} 