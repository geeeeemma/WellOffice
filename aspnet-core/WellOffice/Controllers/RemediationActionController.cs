using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Models;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RemediationActionController : ControllerBase
{
    private readonly WellOfficeContext _context;

    public RemediationActionController(WellOfficeContext context)
    {
        _context = context;
    }

    // GET: api/RemediationAction
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RemediationAction>>> GetRemediationActions()
    {
        return await _context.RemediationActions
            .Include(ra => ra.Sensor)
            .OrderByDescending(ra => ra.ActionDate)
            .ToListAsync();
    }

    // GET: api/RemediationAction/5
    [HttpGet("{id}")]
    public async Task<ActionResult<RemediationAction>> GetRemediationAction(Guid id)
    {
        var remediationAction = await _context.RemediationActions
            .Include(ra => ra.Sensor)
            .FirstOrDefaultAsync(ra => ra.Id == id);

        if (remediationAction == null)
        {
            return NotFound();
        }

        return remediationAction;
    }

    // GET: api/RemediationAction/sensor/5
    [HttpGet("sensor/{sensorId}")]
    public async Task<ActionResult<IEnumerable<RemediationAction>>> GetRemediationActionsBySensor(Guid sensorId)
    {
        return await _context.RemediationActions
            .Include(ra => ra.Sensor)
            .Where(ra => ra.SensorId == sensorId)
            .OrderByDescending(ra => ra.ActionDate)
            .ToListAsync();
    }

    // POST: api/RemediationAction
    [HttpPost]
    public async Task<ActionResult<RemediationAction>> CreateRemediationAction(RemediationAction remediationAction)
    {
        // Verify that Sensor exists
        var sensor = await _context.Sensors.FindAsync(remediationAction.SensorId);
        if (sensor == null)
        {
            return BadRequest("Sensor not found");
        }

        remediationAction.Id = Guid.NewGuid();
        remediationAction.ActionDate = DateTime.UtcNow;
        _context.RemediationActions.Add(remediationAction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRemediationAction), new { id = remediationAction.Id }, remediationAction);
    }
} 