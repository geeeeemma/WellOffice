using Microsoft.AspNetCore.Mvc;
using WellOffice.Models;
using WellOffice.Services;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    // GET: api/Room
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
    {
        var rooms = await _roomService.GetAllAsync();
        return Ok(rooms);
    }

    // GET: api/Room/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Room>> GetRoom(Guid id)
    {
        var room = await _roomService.GetByIdAsync(id);
        if (room == null)
        {
            return NotFound();
        }
        return Ok(room);
    }

    // GET: api/Room/with-sensors
    [HttpGet("with-sensors")]
    public async Task<ActionResult<IEnumerable<Room>>> GetRoomsWithSensors()
    {
        var rooms = await _roomService.GetRoomsWithSensorsAsync();
        return Ok(rooms);
    }

    // GET: api/Room/with-thresholds
    [HttpGet("with-thresholds")]
    public async Task<ActionResult<IEnumerable<Room>>> GetRoomsWithThresholds()
    {
        var rooms = await _roomService.GetRoomsWithThresholdsAsync();
        return Ok(rooms);
    }

    // POST: api/Room
    [HttpPost]
    public async Task<ActionResult<Room>> CreateRoom(Room room)
    {
        try
        {
            var createdRoom = await _roomService.CreateAsync(room);
            return CreatedAtAction(nameof(GetRoom), new { id = createdRoom.Id }, createdRoom);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
} 