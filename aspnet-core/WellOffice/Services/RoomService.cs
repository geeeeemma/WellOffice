using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Models;

namespace WellOffice.Services;

public class RoomService : BaseService<Room>, IRoomService
{
    public RoomService(WellOfficeContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Room>> GetRoomsWithSensorsAsync()
    {
        return await _context.Rooms
            .Include(r => r.Sensors)
            .ToListAsync();
    }

    public async Task<IEnumerable<Room>> GetRoomsWithThresholdsAsync()
    {
        return await _context.Rooms
            .Include(r => r.Thresholds)
            .ToListAsync();
    }

    public override async Task<Room> CreateAsync(Room entity)
    {
        entity.Id = Guid.NewGuid();
        return await base.CreateAsync(entity);
    }
} 