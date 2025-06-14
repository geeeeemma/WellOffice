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

    public DashboardController(IParameterService parameterService, IEnvironmentService environmentService)
    {
        _parameterService = parameterService;
        _environmentService = environmentService;
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
} 