using Microsoft.AspNetCore.Mvc;
using WellOffice.Models;
using WellOffice.Services;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParameterController : ControllerBase
{
    private readonly IParameterService _parameterService;

    public ParameterController(IParameterService parameterService)
    {
        _parameterService = parameterService;
    }

    // GET: api/Parameter
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Parameter>>> GetParameters()
    {
        var parameters = await _parameterService.GetAllAsync();
        return Ok(parameters);
    }

    // GET: api/Parameter/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Parameter>> GetParameter(Guid id)
    {
        var parameter = await _parameterService.GetByIdAsync(id);
        if (parameter == null)
        {
            return NotFound();
        }
        return Ok(parameter);
    }

    // GET: api/Parameter/with-sensors
    [HttpGet("with-sensors")]
    public async Task<ActionResult<IEnumerable<Parameter>>> GetParametersWithSensors()
    {
        var parameters = await _parameterService.GetParametersWithSensorsAsync();
        return Ok(parameters);
    }

    // GET: api/Parameter/with-thresholds
    [HttpGet("with-thresholds")]
    public async Task<ActionResult<IEnumerable<Parameter>>> GetParametersWithThresholds()
    {
        var parameters = await _parameterService.GetParametersWithThresholdsAsync();
        return Ok(parameters);
    }

    // POST: api/Parameter
    [HttpPost]
    public async Task<ActionResult<Parameter>> CreateParameter(Parameter parameter)
    {
        try
        {
            var createdParameter = await _parameterService.CreateAsync(parameter);
            return CreatedAtAction(nameof(GetParameter), new { id = createdParameter.Id }, createdParameter);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
} 