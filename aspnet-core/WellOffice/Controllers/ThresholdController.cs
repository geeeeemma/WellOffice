using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Models;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThresholdController : ControllerBase
{
    private readonly WellOfficeContext _context;

    public ThresholdController(WellOfficeContext context)
    {
        _context = context;
    }

    // GET: api/Threshold
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Threshold>>> GetThresholds()
    {
        return await _context.Thresholds
            .Include(t => t.Room)
            .Include(t => t.Parameter)
            .ToListAsync();
    }

    // GET: api/Threshold/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Threshold>> GetThreshold(Guid id)
    {
        var threshold = await _context.Thresholds
            .Include(t => t.Room)
            .Include(t => t.Parameter)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (threshold == null)
        {
            return NotFound();
        }

        return threshold;
    }

    // GET: api/Threshold/room/5
    [HttpGet("room/{roomId}")]
    public async Task<ActionResult<IEnumerable<Threshold>>> GetThresholdsByRoom(Guid roomId)
    {
        return await _context.Thresholds
            .Include(t => t.Room)
            .Include(t => t.Parameter)
            .Where(t => t.RoomId == roomId)
            .ToListAsync();
    }

    // POST: api/Threshold
    [HttpPost]
    public async Task<ActionResult<Threshold>> CreateThreshold(Threshold threshold)
    {
        // Verify that Room and Parameter exist
        var roomExists = await _context.Rooms.AnyAsync(r => r.Id == threshold.RoomId);
        var parameterExists = await _context.Parameters.AnyAsync(p => p.Id == threshold.ParameterId);

        if (!roomExists || !parameterExists)
        {
            return BadRequest("Room or Parameter not found");
        }

        // Verify that thresholds are valid
        if (threshold.OptimalMinValue > threshold.OptimalMaxValue ||
            threshold.AcceptableMinValue > threshold.AcceptableMaxValue ||
            threshold.OptimalMinValue < threshold.AcceptableMinValue ||
            threshold.OptimalMaxValue > threshold.AcceptableMaxValue)
        {
            return BadRequest("Invalid threshold values");
        }

        threshold.Id = Guid.NewGuid();
        _context.Thresholds.Add(threshold);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetThreshold), new { id = threshold.Id }, threshold);
    }
} 