using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Models;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SensorDataController : ControllerBase
{
    private readonly WellOfficeContext _context;

    public SensorDataController(WellOfficeContext context)
    {
        _context = context;
    }

    // GET: api/SensorData
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SensorData>>> GetSensorData()
    {
        return await _context.SensorData
            .Include(sd => sd.Sensor)
            .ToListAsync();
    }

    // GET: api/SensorData/5
    [HttpGet("{id}")]
    public async Task<ActionResult<SensorData>> GetSensorData(Guid id)
    {
        var sensorData = await _context.SensorData
            .Include(sd => sd.Sensor)
            .FirstOrDefaultAsync(sd => sd.Id == id);

        if (sensorData == null)
        {
            return NotFound();
        }

        return sensorData;
    }

    // GET: api/SensorData/sensor/5
    [HttpGet("sensor/{sensorId}")]
    public async Task<ActionResult<IEnumerable<SensorData>>> GetSensorDataBySensor(Guid sensorId)
    {
        return await _context.SensorData
            .Include(sd => sd.Sensor)
            .Where(sd => sd.SensorId == sensorId)
            .OrderByDescending(sd => sd.DetectionDate)
            .ToListAsync();
    }

    // POST: api/SensorData
    [HttpPost]
    public async Task<ActionResult<SensorData>> CreateSensorData(SensorData sensorData)
    {
        // Verify that Sensor exists and is active
        var sensor = await _context.Sensors.FindAsync(sensorData.SensorId);
        if (sensor == null)
        {
            return BadRequest("Sensor not found");
        }
        if (!sensor.IsActive)
        {
            return BadRequest("Sensor is not active");
        }

        sensorData.Id = Guid.NewGuid();
        sensorData.DetectionDate = DateTime.UtcNow;
        _context.SensorData.Add(sensorData);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSensorData), new { id = sensorData.Id }, sensorData);
    }
} 