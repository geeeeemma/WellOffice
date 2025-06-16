using System;

namespace WellOffice.DTOs
{
    public class SensorDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid ParameterId { get; set; }
        public Guid RoomId { get; set; }
        public bool IsActive { get; set; }
    }

    public class SensorDetailDto : SensorDto
    {
        public ParameterDto Parameter { get; set; }
        public RoomDto Room { get; set; }
        public ICollection<SensorDataDto> LatestData { get; set; }
        public ICollection<RemediationActionDto> LatestActions { get; set; }
    }
} 