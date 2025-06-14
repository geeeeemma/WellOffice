using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Models;

namespace WellOffice.Services;

public class SensorService : BaseService<Sensor>, ISensorService
{
    public SensorService(WellOfficeContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Sensor>> GetSensorsWithDetailsAsync()
    {
        return await _context.Sensors
            .Include(s => s.Room)
            .Include(s => s.Parameter)
            .ToListAsync();
    }

    public async Task<bool> IsSensorActiveAsync(Guid id)
    {
        var sensor = await _context.Sensors.FindAsync(id);
        return sensor?.IsActive ?? false;
    }

    public async Task<IEnumerable<Sensor>> GetSensorsByRoomAsync(Guid roomId)
    {
        return await _context.Sensors
            .Include(s => s.Room)
            .Include(s => s.Parameter)
            .Where(s => s.RoomId == roomId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Sensor>> GetSensorsByParameterAsync(Guid parameterId)
    {
        return await _context.Sensors
            .Include(s => s.Room)
            .Include(s => s.Parameter)
            .Where(s => s.ParameterId == parameterId)
            .ToListAsync();
    }

    public override async Task<Sensor> CreateAsync(Sensor entity)
    {
        // Verify that Room and Parameter exist
        var roomExists = await _context.Rooms.AnyAsync(r => r.Id == entity.RoomId);
        var parameterExists = await _context.Parameters.AnyAsync(p => p.Id == entity.ParameterId);

        if (!roomExists || !parameterExists)
        {
            throw new InvalidOperationException("Room or Parameter not found");
        }

        entity.Id = Guid.NewGuid();
        return await base.CreateAsync(entity);
    }
} 