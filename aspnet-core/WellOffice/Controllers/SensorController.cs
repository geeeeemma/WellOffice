using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Models;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SensorController : ControllerBase
{
    private readonly WellOfficeContext _context;

    public SensorController(WellOfficeContext context)
    {
        _context = context;
    }

    // GET: api/Sensor
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Sensor>>> GetSensors()
    {
        return await _context.Sensors
            .Include(s => s.Room)
            .Include(s => s.Parameter)
            .ToListAsync();
    }

    // GET: api/Sensor/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Sensor>> GetSensor(Guid id)
    {
        var sensor = await _context.Sensors
            .Include(s => s.Room)
            .Include(s => s.Parameter)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sensor == null)
        {
            return NotFound();
        }

        return sensor;
    }

    // POST: api/Sensor
    [HttpPost]
    public async Task<ActionResult<Sensor>> CreateSensor(Sensor sensor)
    {
        // Verify that Room and Parameter exist
        var roomExists = await _context.Rooms.AnyAsync(r => r.Id == sensor.RoomId);
        var parameterExists = await _context.Parameters.AnyAsync(p => p.Id == sensor.ParameterId);

        if (!roomExists || !parameterExists)
        {
            return BadRequest("Room or Parameter not found");
        }

        sensor.Id = Guid.NewGuid();
        _context.Sensors.Add(sensor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSensor), new { id = sensor.Id }, sensor);
    }
} 