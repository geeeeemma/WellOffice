using Microsoft.AspNetCore.Mvc;
using WellOffice.Models;
using WellOffice.Services;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SensorController : ControllerBase
{
    private readonly ISensorService _sensorService;

    public SensorController(ISensorService sensorService)
    {
        _sensorService = sensorService;
    }

    // GET: api/Sensor
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Sensor>>> GetSensors()
    {
        var sensors = await _sensorService.GetSensorsWithDetailsAsync();
        return Ok(sensors);
    }

    // GET: api/Sensor/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Sensor>> GetSensor(Guid id)
    {
        var sensor = await _sensorService.GetByIdAsync(id);
        if (sensor == null)
        {
            return NotFound();
        }
        return Ok(sensor);
    }

    // GET: api/Sensor/room/5
    [HttpGet("room/{roomId}")]
    public async Task<ActionResult<IEnumerable<Sensor>>> GetSensorsByRoom(Guid roomId)
    {
        var sensors = await _sensorService.GetSensorsByRoomAsync(roomId);
        return Ok(sensors);
    }

    // GET: api/Sensor/parameter/5
    [HttpGet("parameter/{parameterId}")]
    public async Task<ActionResult<IEnumerable<Sensor>>> GetSensorsByParameter(Guid parameterId)
    {
        var sensors = await _sensorService.GetSensorsByParameterAsync(parameterId);
        return Ok(sensors);
    }

    // POST: api/Sensor
    [HttpPost]
    public async Task<ActionResult<Sensor>> CreateSensor(Sensor sensor)
    {
        try
        {
            var createdSensor = await _sensorService.CreateAsync(sensor);
            return CreatedAtAction(nameof(GetSensor), new { id = createdSensor.Id }, createdSensor);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // PUT: api/Sensor/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSensor(Guid id, Sensor sensor)
    {
        if (id != sensor.Id)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            await _sensorService.UpdateAsync(sensor);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
} 