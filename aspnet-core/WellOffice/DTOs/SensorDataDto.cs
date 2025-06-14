using System;

namespace WellOffice.DTOs
{
    public class SensorDataDto
    {
        public Guid Id { get; set; }
        public Guid SensorId { get; set; }
        public double Value { get; set; }
        public DateTime DetectionDate { get; set; }
    }

    public class SensorDataDetailDto : SensorDataDto
    {
        public SensorDto Sensor { get; set; }
    }
} 