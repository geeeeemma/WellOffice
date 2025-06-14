using WellOffice.Models;

namespace WellOffice.Services;

public interface IRoomService : IBaseService<Room>
{
    Task<IEnumerable<Room>> GetRoomsWithSensorsAsync();
    Task<IEnumerable<Room>> GetRoomsWithThresholdsAsync();
} 