using Microsoft.AspNetCore.Mvc;
using WellOffice.Models;
using WellOffice.Services;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThresholdController : ControllerBase
{
    private readonly IThresholdService _thresholdService;

    public ThresholdController(IThresholdService thresholdService)
    {
        _thresholdService = thresholdService;
    }

    // GET: api/Threshold
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Threshold>>> GetThresholds()
    {
        var thresholds = await _thresholdService.GetAllAsync();
        return Ok(thresholds);
    }

    // GET: api/Threshold/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Threshold>> GetThreshold(Guid id)
    {
        var threshold = await _thresholdService.GetByIdAsync(id);
        if (threshold == null)
        {
            return NotFound();
        }
        return Ok(threshold);
    }

    // GET: api/Threshold/room/5
    [HttpGet("room/{roomId}")]
    public async Task<ActionResult<IEnumerable<Threshold>>> GetThresholdsByRoom(Guid roomId)
    {
        var thresholds = await _thresholdService.GetThresholdsByRoomAsync(roomId);
        return Ok(thresholds);
    }

    // GET: api/Threshold/parameter/5
    [HttpGet("parameter/{parameterId}")]
    public async Task<ActionResult<IEnumerable<Threshold>>> GetThresholdsByParameter(Guid parameterId)
    {
        var thresholds = await _thresholdService.GetThresholdsByParameterAsync(parameterId);
        return Ok(thresholds);
    }

    // POST: api/Threshold
    [HttpPost]
    public async Task<ActionResult<Threshold>> CreateThreshold(Threshold threshold)
    {
        try
        {
            var createdThreshold = await _thresholdService.CreateThresholdAsync(threshold);
            return CreatedAtAction(nameof(GetThreshold), new { id = createdThreshold.Id }, createdThreshold);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
} 