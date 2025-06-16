using WellOffice.Models;

namespace WellOffice.Services;

public interface ISensorService : IBaseService<Sensor>
{
    Task<IEnumerable<Sensor>> GetSensorsWithDetailsAsync();
    Task<bool> IsSensorActiveAsync(Guid id);
    Task<IEnumerable<Sensor>> GetSensorsByRoomAsync(Guid roomId);
    Task<IEnumerable<Sensor>> GetSensorsByParameterAsync(Guid parameterId);
} 