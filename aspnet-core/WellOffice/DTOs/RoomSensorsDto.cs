namespace WellOffice.DTOs
{
    public class RoomSensorsForRequestDto
    {
        public string RoomId { get; set; }

        public ICollection<SensorForRoomDto> Sensors { get; set; }
    }

    public class SensorForRoomDto
    {
        public string Id { get; set; }

        public int Value { get; set; }
    }
}
