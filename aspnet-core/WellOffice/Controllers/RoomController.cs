using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.DTOs;
using WellOffice.Models;
using WellOffice.Services;

namespace WellOffice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomController : ControllerBase
{
    private readonly IRoomService _roomService;
    private readonly WellOfficeContext _context;

    public RoomController(IRoomService roomService, WellOfficeContext context)
    {
        _roomService = roomService;
        _context = context;
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
    public async Task<ActionResult<IEnumerable<RoomWithSensorsDto>>> GetRoomsWithSensors()
    {
        var rooms = await _roomService.GetRoomsWithSensorsAsync();

        var sensorIds = rooms
        .SelectMany(r => r.Sensors)
        .Select(s => s.Id)
            .ToList();

        var latestSensorData = await _context.SensorData
            .Where(sd => sensorIds.Contains(sd.SensorId))
            .GroupBy(sd => sd.SensorId)
            .Select(g => g.OrderByDescending(sd => sd.DetectionDate).First())
            .ToListAsync();

        var result = await this.GetRoomSensorsDtos(rooms, latestSensorData);

        

        return Ok(result);
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

    private async Task<IEnumerable<RoomWithSensorsDto>> GetRoomSensorsDtos(IEnumerable<Room> rooms, List<SensorData> sensorData)
    {
        var dtoList = rooms.Select(room => new RoomWithSensorsDto
        {
            Id = room.Id.ToString(),
            Name = room.Name,


            Sensors = room.Sensors?.Select(sensor => new SensorInfoDto
            {
                Id = sensor.Id.ToString(),
                Name = sensor.Name,
                Type = sensor.Parameter?.Name,
                UnitMeasure = sensor.Parameter?.UnitMeasure?.ToString(),
                LastValue = sensorData.FirstOrDefault(sd => sd.SensorId == sensor.Id)?.Value
            }).ToList() ?? new List<SensorInfoDto>(),

            RoomThresholds = room.Thresholds?.Select(threshold => new ThresholdForRoomDto
            {
                SensorType = threshold.Parameter?.Name,
                OptimalMinValue = threshold.OptimalMinValue.ToString(),
                OptimalMaxValue = threshold.OptimalMaxValue.ToString(),
                AcceptableMinValue = threshold.AcceptableMinValue.ToString(),
                AcceptableMaxValue = threshold.AcceptableMaxValue.ToString()
            }).ToList() ?? new List<ThresholdForRoomDto>(),

            ParameterThresholds = room.Sensors?
                .SelectMany(s => s.Parameter?.Thresholds ?? new List<Threshold>())
                .Select(threshold => new ThresholdForRoomDto
                {
                    SensorType = threshold.Parameter?.Name,
                    OptimalMinValue = threshold.OptimalMinValue.ToString(),
                    OptimalMaxValue = threshold.OptimalMaxValue.ToString(),
                    AcceptableMinValue = threshold.AcceptableMinValue.ToString(),
                    AcceptableMaxValue = threshold.AcceptableMaxValue.ToString()
                }).ToList() ?? new List<ThresholdForRoomDto>(),

            
        });

        return dtoList;
    }
} 