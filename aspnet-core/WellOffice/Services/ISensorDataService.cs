using WellOffice.Models;

namespace WellOffice.Services;

public interface ISensorDataService : IBaseService<SensorData>
{
    Task<IEnumerable<SensorData>> GetSensorDataBySensorAsync(Guid sensorId);
    Task<IEnumerable<SensorData>> GetLatestSensorDataAsync(Guid sensorId, int count = 10);
    Task<SensorData> CreateSensorDataAsync(SensorData sensorData, bool validateSensor = true);
} 