using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WellOffice.DTOs;
using WellOffice.Models;
using WellOffice.Services;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SensorDataController : ControllerBase
{
    private readonly ISensorDataService _sensorDataService;

    public SensorDataController(ISensorDataService sensorDataService)
    {
        _sensorDataService = sensorDataService;
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

            var sensor = await _sensorDataService.GetByIdAsync(sensorId);
            if (sensor == null)
            {
                throw new InvalidOperationException($"Sensor {sensorDto.Id} not found or inactive.");
            }

            result.Add(new SensorData
            {
                Id = Guid.NewGuid(),
                SensorId = sensorId,
                Value = sensorDto.Value,
                DetectionDate = DateTime.UtcNow
            });
        }

        return result;
    }
} 