using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Models;

namespace WellOffice.Services;

public class ThresholdService : BaseService<Threshold>, IThresholdService
{
    public ThresholdService(WellOfficeContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Threshold>> GetThresholdsByRoomAsync(Guid roomId)
    {
        return await _context.Thresholds
            .Include(t => t.Room)
            .Include(t => t.Parameter)
            .Where(t => t.RoomId == roomId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Threshold>> GetThresholdsByParameterAsync(Guid parameterId)
    {
        return await _context.Thresholds
            .Include(t => t.Room)
            .Include(t => t.Parameter)
            .Where(t => t.ParameterId == parameterId)
            .ToListAsync();
    }

    public async Task<bool> ValidateThresholdValuesAsync(Threshold threshold)
    {
        return threshold.OptimalMinValue <= threshold.OptimalMaxValue &&
               threshold.AcceptableMinValue <= threshold.AcceptableMaxValue &&
               threshold.OptimalMinValue >= threshold.AcceptableMinValue &&
               threshold.OptimalMaxValue <= threshold.AcceptableMaxValue;
    }

    public async Task<Threshold> CreateThresholdAsync(Threshold threshold, bool validateReferences = true)
    {
        if (validateReferences)
        {
            var roomExists = await _context.Rooms.AnyAsync(r => r.Id == threshold.RoomId);
            var parameterExists = await _context.Parameters.AnyAsync(p => p.Id == threshold.ParameterId);

            if (!roomExists || !parameterExists)
            {
                throw new InvalidOperationException("Room or Parameter not found");
            }
        }

        if (!await ValidateThresholdValuesAsync(threshold))
        {
            throw new InvalidOperationException("Invalid threshold values");
        }

        threshold.Id = Guid.NewGuid();
        return await base.CreateAsync(threshold);
    }

    public override async Task<Threshold> CreateAsync(Threshold entity)
    {
        return await CreateThresholdAsync(entity);
    }

    

    public override async Task UpdateAsync(Threshold entity)
    {
        var existingThreshold = await _context.Thresholds.FindAsync(entity.Id);
        if (existingThreshold == null)
        {
            throw new KeyNotFoundException($"Threshold with ID {entity.Id} not found");
        }

        // Verify that Room and Parameter exist
        var roomExists = await _context.Rooms.AnyAsync(r => r.Id == entity.RoomId);
        var parameterExists = await _context.Parameters.AnyAsync(p => p.Id == entity.ParameterId);

        if (!roomExists || !parameterExists)
        {
            throw new InvalidOperationException("Room or Parameter not found");
        }

        // Validate threshold values
        if (!await ValidateThresholdValuesAsync(entity))
        {
            throw new InvalidOperationException("Invalid threshold values");
        }

        _context.Entry(existingThreshold).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();
    }
} 