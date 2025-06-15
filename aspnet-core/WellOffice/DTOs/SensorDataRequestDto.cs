namespace WellOffice.DTOs
{
    public class SensorDataRequestDto
    {
        public IEnumerable<RoomSensorsForRequestDto> rooms { get; set; }
    }
}
