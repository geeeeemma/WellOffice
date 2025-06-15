namespace WellOffice.DTOs
{
    public class RoomWithSensorsDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<SensorInfoDto> Sensors { get; set; }
        // Soglie configurate sulla stanza
        public List<ThresholdForRoomDto> RoomThresholds { get; set; }

        // Eventualmente anche:
        public List<ThresholdForRoomDto> ParameterThresholds { get; set; }
    }

    public class SensorInfoDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string UnitMeasure { get; set; }
    }

    public class ThresholdForRoomDto
    {
        public string SensorType { get; set; }

        public string OptimalMinValue { get; set; }

        public string OptimalMaxValue { get; set; }

        public string AcceptableMinValue { get; set; }

        public string AcceptableMaxValue { get; set; }
    }
}
