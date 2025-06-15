using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Models;

namespace WellOffice.Services;

public class SensorDataService : BaseService<SensorData>, ISensorDataService
{
    public SensorDataService(WellOfficeContext context) : base(context)
    {
    }

    public async Task<IEnumerable<SensorData>> GetSensorDataBySensorAsync(Guid sensorId)
    {
        return await _context.SensorData
            .Include(sd => sd.Sensor)
            .Where(sd => sd.SensorId == sensorId)
            .OrderByDescending(sd => sd.DetectionDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<SensorData>> GetLatestSensorDataAsync(Guid sensorId, int count = 10)
    {
        return await _context.SensorData
            .Include(sd => sd.Sensor)
            .Where(sd => sd.SensorId == sensorId)
            .OrderByDescending(sd => sd.DetectionDate)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<SensorData>> GetHistoricalDataForParameterAsync(Guid roomId, Guid parameterId, int hours = 24)
    {
        var cutoffDate = DateTime.UtcNow.AddHours(-hours);
        
        return await _context.SensorData
            .Include(sd => sd.Sensor)
            .Where(sd => sd.Sensor.RoomId == roomId 
                      && sd.Sensor.ParameterId == parameterId 
                      && sd.Sensor.IsActive 
                      && sd.DetectionDate >= cutoffDate)
            .OrderBy(sd => sd.DetectionDate)
            .ToListAsync();
    }

    public async Task<SensorData> CreateSensorDataAsync(SensorData sensorData, bool validateSensor = true)
    {
        if (validateSensor)
        {
            var sensor = await _context.Sensors.FindAsync(sensorData.SensorId);
            if (sensor == null)
            {
                throw new InvalidOperationException("Sensor not found");
            }
            if (!sensor.IsActive)
            {
                throw new InvalidOperationException("Sensor is not active");
            }
        }

        sensorData.Id = Guid.NewGuid();
        sensorData.DetectionDate = DateTime.UtcNow;
        return await base.CreateAsync(sensorData);
    }

    public override async Task<SensorData> CreateAsync(SensorData entity)
    {
        return await CreateSensorDataAsync(entity);
    }
} 