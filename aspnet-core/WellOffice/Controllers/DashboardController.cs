using Microsoft.AspNetCore.Mvc;
using WellOffice.Models;
using WellOffice.Services;
using WellOffice.DTOs;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IParameterService _parameterService;
    private readonly IEnvironmentService _environmentService;
    private readonly ISensorDataService _sensorDataService;

    public DashboardController(IParameterService parameterService, IEnvironmentService environmentService, ISensorDataService sensorDataService)
    {
        _parameterService = parameterService;
        _environmentService = environmentService;
        _sensorDataService = sensorDataService;
    }

    [HttpGet("environments")]
    public async Task<ActionResult<IEnumerable<EnvironmentDto>>> GetEnvironments()
    {
        try
        {
            var environments = await _environmentService.GetEnvironmentsAsync();
            return Ok(environments);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Errore nel recupero degli ambienti", error = ex.Message });
        }
    }

    [HttpGet("environments/{environmentId}/parameters/{parameterId}/historical")]
    public async Task<ActionResult<IEnumerable<HistoricalDataDto>>> GetParameterHistoricalData(
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
            return StatusCode(500, new { message = "Error retrieving historical data", error = ex.Message });
        }
    }
} 