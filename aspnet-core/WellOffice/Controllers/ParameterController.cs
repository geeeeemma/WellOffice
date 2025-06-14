using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Models;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParameterController : ControllerBase
{
    private readonly WellOfficeContext _context;

    public ParameterController(WellOfficeContext context)
    {
        _context = context;
    }

    // GET: api/Parameter
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Parameter>>> GetParameters()
    {
        return await _context.Parameters.ToListAsync();
    }

    // GET: api/Parameter/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Parameter>> GetParameter(Guid id)
    {
        var parameter = await _context.Parameters.FindAsync(id);

        if (parameter == null)
        {
            return NotFound();
        }

        return parameter;
    }

    // POST: api/Parameter
    [HttpPost]
    public async Task<ActionResult<Parameter>> CreateParameter(Parameter parameter)
    {
        parameter.Id = Guid.NewGuid();
        _context.Parameters.Add(parameter);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetParameter), new { id = parameter.Id }, parameter);
    }
} 