using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.DTOs;
using WellOffice.Models;

namespace WellOffice.Services;

public class EnvironmentService : IEnvironmentService
{
    private readonly WellOfficeContext _context;

    public EnvironmentService(WellOfficeContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<EnvironmentDto>> GetEnvironmentsAsync()
    {
        var rooms = await _context.Rooms
            .Include(r => r.Sensors)
                .ThenInclude(s => s.Parameter)
            .Include(r => r.Sensors)
                .ThenInclude(s => s.SensorData.OrderByDescending(sd => sd.DetectionDate).Take(1))
            .Include(r => r.Thresholds)
                .ThenInclude(t => t.Parameter)
            .ToListAsync();

        var environments = new List<EnvironmentDto>();

        foreach (var room in rooms)
        {
            var parameters = new List<EnvironmentParameterDto>();

            // Raggruppa sensori per parametro
            var sensorsByParameter = room.Sensors.GroupBy(s => s.Parameter);

            foreach (var parameterGroup in sensorsByParameter)
            {
                var parameter = parameterGroup.Key;
                var sensors = parameterGroup.ToList();

                // Trova la soglia per questo parametro in questa stanza
                var threshold = room.Thresholds.FirstOrDefault(t => t.ParameterId == parameter.Id);

                // Ottieni il valore più recente dai sensori attivi
                var latestValue = sensors
                    .Where(s => s.IsActive)
                    .SelectMany(s => s.SensorData)
                    .OrderByDescending(sd => sd.DetectionDate)
                    .FirstOrDefault();

                // Calcola status
                string? status = null;
                var hasActiveSensors = sensors.Any(s => s.IsActive);
                var isActive = hasActiveSensors && latestValue != null;

                if (isActive && threshold != null && latestValue != null)
                {
                    var value = (double)latestValue.Value;
                    
                    if (value >= (double)threshold.OptimalMinValue && value <= (double)threshold.OptimalMaxValue)
                        status = "optimal";
                    else if (value >= (double)threshold.AcceptableMinValue && value <= (double)threshold.AcceptableMaxValue)
                        status = "borderline";
                    else
                        status = "critical";
                }

                parameters.Add(new EnvironmentParameterDto
                {
                    Id = parameter.Id.ToString(),
                    Name = parameter.Name,
                    Value = latestValue != null ? (double)latestValue.Value : 0,
                    Unit = GetUnitString(parameter.UnitMeasure),
                    Status = status,
                    Thresholds = threshold != null ? new ThresholdsDto
                    {
                        Optimal = new OptimalRangeDto
                        {
                            Min = (double)threshold.OptimalMinValue,
                            Max = (double)threshold.OptimalMaxValue
                        },
                        Borderline = new BorderlineRangeDto
                        {
                            Min = (double)threshold.AcceptableMinValue,
                            Max = (double)threshold.AcceptableMaxValue
                        }
                    } : new ThresholdsDto(),
                    IsActive = isActive,
                    Sensors = sensors.Select(s => new EnvironmentSensorDto
                    {
                        Id = s.Id.ToString(),
                        Name = s.Name,
                        IsActive = s.IsActive
                    }).ToList()
                });
            }

            // Data ultimo aggiornamento (più recente tra tutti i sensori della stanza)
            var lastUpdated = room.Sensors
                .SelectMany(s => s.SensorData)
                .OrderByDescending(sd => sd.DetectionDate)
                .FirstOrDefault()?.DetectionDate ?? DateTime.UtcNow;

            environments.Add(new EnvironmentDto
            {
                Id = room.Id.ToString(),
                Name = room.Name,
                Type = room.Name, // type = name come richiesto
                Area = (double)room.Footage,
                Parameters = parameters,
                LastUpdated = lastUpdated.ToString("O") // ISO 8601 format
            });
        }

        return environments;
    }

    private static string GetUnitString(UnitMeasure unitMeasure)
    {
        return unitMeasure switch
        {
            UnitMeasure.Temperature => "°C",
            UnitMeasure.Humidity => "%",
            UnitMeasure.CO2 => "ppm",
            UnitMeasure.VOC => "ppb",
            UnitMeasure.Pressure => "hPa",
            UnitMeasure.Light => "lux",
            UnitMeasure.Noise => "dB",
            UnitMeasure.AirFlow => "m³/h",
            UnitMeasure.Occupancy => "persone/m²",
            UnitMeasure.AirQuality => "IAQ",
            _ => ""
        };
    }
} 