using System;

namespace WellOffice.DTOs
{
    public class RemediationActionDto
    {
        public Guid Id { get; set; }
        public Guid SensorId { get; set; }
        public string Action { get; set; }
        public DateTime ActionDate { get; set; }
    }

    public class RemediationActionDetailDto : RemediationActionDto
    {
        public SensorDto Sensor { get; set; }
    }
} 