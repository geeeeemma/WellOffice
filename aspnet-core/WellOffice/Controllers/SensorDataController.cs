using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.DTOs;
using WellOffice.Models;
using WellOffice.Services;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SensorDataController : ControllerBase
{
    private readonly ISensorDataService _sensorDataService;
    private readonly ISensorService _sensorService;
    private readonly WellOfficeContext _context;

    public SensorDataController(ISensorDataService sensorDataService, ISensorService sensorService, WellOfficeContext context)
    {
        _sensorDataService = sensorDataService;
        _sensorService = sensorService;
        _context = context;
    }

    // GET: api/SensorData
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SensorData>>> GetSensorData()
    {
        var sensorData = await _sensorDataService.GetAllAsync();
        return Ok(sensorData);
    }

    // GET: api/SensorData/5
    [HttpGet("{id}")]
    public async Task<ActionResult<SensorData>> GetSensorData(Guid id)
    {
        var sensorData = await _sensorDataService.GetByIdAsync(id);
        if (sensorData == null)
        {
            return NotFound();
        }
        return Ok(sensorData);
    }

    // GET: api/SensorData/sensor/5
    [HttpGet("sensor/{sensorId}")]
    public async Task<ActionResult<IEnumerable<SensorData>>> GetSensorDataBySensor(Guid sensorId)
    {
        var sensorData = await _sensorDataService.GetSensorDataBySensorAsync(sensorId);
        return Ok(sensorData);
    }

    // GET: api/SensorData/sensor/5/latest
    [HttpGet("sensor/{sensorId}/latest")]
    public async Task<ActionResult<IEnumerable<SensorData>>> GetLatestSensorData(Guid sensorId, [FromQuery] int count = 10)
    {
        var sensorData = await _sensorDataService.GetLatestSensorDataAsync(sensorId, count);
        return Ok(sensorData);
    }

    // GET: api/SensorData/environment/{environmentId}/parameter/{parameterId}/historical
    [HttpGet("environment/{environmentId}/parameter/{parameterId}/historical")]
    public async Task<ActionResult<IEnumerable<HistoricalDataDto>>> GetHistoricalDataForParameter(
        Guid environmentId, 
        Guid parameterId, 
        [FromQuery] int hours = 24)
    {
        try
        {
            var sensorData = await _sensorDataService.GetHistoricalDataForParameterAsync(environmentId, parameterId, hours);
            
            var historicalData = sensorData.Select(sd => new HistoricalDataDto
            {
                Timestamp = sd.DetectionDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                Value = (double)sd.Value
            }).ToList();

            return Ok(historicalData);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error retrieving historical data: {ex.Message}");
        }
    }

    // POST: api/SensorData
    [HttpPost]
    public async Task<ActionResult<IEnumerable<SensorData>>> CreateSensorData(RoomSensorsForRequestDto sensorData)
    {
        var sensorDataList = await ConvertToSensorDataListAsync(sensorData);


        try
        {
            foreach (var data in sensorDataList)
            {
                var createdSensorData = await _sensorDataService.CreateSensorDataAsync(data);
            }
            return Ok(sensorDataList);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    private async Task<List<SensorData>> ConvertToSensorDataListAsync(RoomSensorsForRequestDto dto)
    {
        var result = new List<SensorData>();

        foreach (var sensorDto in dto.Sensors)
        {
            if (!Guid.TryParse(sensorDto.Id, out var sensorId))
            {
                throw new InvalidOperationException($"Invalid sensor ID format: {sensorDto.Id}");
            }

            var sensor = await _sensorService.GetByIdAsync(sensorId);
            if (sensor == null)
            {
                throw new InvalidOperationException($"Sensor {sensorDto.Id} not found or inactive.");
            }

            result.Add(new SensorData
            {
                Id = Guid.NewGuid(),
                SensorId = sensorId,
                Value = (decimal)(sensorDto?.Value ?? 0),
                DetectionDate = DateTime.UtcNow
            });
        }

        return result;
    }
} 