using WellOffice.Models;

namespace WellOffice.Services;

public interface IThresholdService : IBaseService<Threshold>
{
    Task<IEnumerable<Threshold>> GetThresholdsByRoomAsync(Guid roomId);
    Task<IEnumerable<Threshold>> GetThresholdsByParameterAsync(Guid parameterId);
    Task<bool> ValidateThresholdValuesAsync(Threshold threshold);
    Task<Threshold> CreateThresholdAsync(Threshold threshold, bool validateReferences = true);
} 