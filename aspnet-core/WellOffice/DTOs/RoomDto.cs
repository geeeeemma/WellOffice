using System;
using System.Collections.Generic;

namespace WellOffice.DTOs
{
    public class RoomDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public double Footage { get; set; }
        public double CeilingHeight { get; set; }
    }

    public class RoomDetailDto : RoomDto
    {
        public ICollection<SensorDto> Sensors { get; set; }
        public ICollection<ThresholdDto> Thresholds { get; set; }
    }
} 