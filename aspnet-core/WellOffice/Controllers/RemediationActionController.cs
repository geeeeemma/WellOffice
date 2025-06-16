using Microsoft.AspNetCore.Mvc;
using WellOffice.Models;
using WellOffice.Services;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RemediationActionController : ControllerBase
{
    private readonly IRemediationActionService _remediationActionService;

    public RemediationActionController(IRemediationActionService remediationActionService)
    {
        _remediationActionService = remediationActionService;
    }

    // GET: api/RemediationAction
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RemediationAction>>> GetRemediationActions()
    {
        var actions = await _remediationActionService.GetAllAsync();
        return Ok(actions);
    }

    // GET: api/RemediationAction/5
    [HttpGet("{id}")]
    public async Task<ActionResult<RemediationAction>> GetRemediationAction(Guid id)
    {
        var action = await _remediationActionService.GetByIdAsync(id);
        if (action == null)
        {
            return NotFound();
        }
        return Ok(action);
    }

    // GET: api/RemediationAction/sensor/5
    [HttpGet("sensor/{sensorId}")]
    public async Task<ActionResult<IEnumerable<RemediationAction>>> GetRemediationActionsBySensor(Guid sensorId)
    {
        var actions = await _remediationActionService.GetRemediationActionsBySensorAsync(sensorId);
        return Ok(actions);
    }

    // GET: api/RemediationAction/sensor/5/latest
    [HttpGet("sensor/{sensorId}/latest")]
    public async Task<ActionResult<IEnumerable<RemediationAction>>> GetLatestRemediationActions(Guid sensorId, [FromQuery] int count = 10)
    {
        var actions = await _remediationActionService.GetLatestRemediationActionsAsync(sensorId, count);
        return Ok(actions);
    }

    // POST: api/RemediationAction
    [HttpPost]
    public async Task<ActionResult<RemediationAction>> CreateRemediationAction(RemediationAction action)
    {
        try
        {
            var createdAction = await _remediationActionService.CreateRemediationActionAsync(action);
            return CreatedAtAction(nameof(GetRemediationAction), new { id = createdAction.Id }, createdAction);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
} 