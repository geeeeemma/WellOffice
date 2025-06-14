using WellOffice.Models;

namespace WellOffice.Services;

public interface IRemediationActionService : IBaseService<RemediationAction>
{
    Task<IEnumerable<RemediationAction>> GetRemediationActionsBySensorAsync(Guid sensorId);
    Task<IEnumerable<RemediationAction>> GetLatestRemediationActionsAsync(Guid sensorId, int count = 10);
    Task<RemediationAction> CreateRemediationActionAsync(RemediationAction action, bool validateSensor = true);
} 