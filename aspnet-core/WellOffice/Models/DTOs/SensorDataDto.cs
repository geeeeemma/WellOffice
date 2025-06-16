using System;

namespace WellOffice.Models.DTOs;

public class SensorDataDto
{
    public Guid Id { get; set; }
    public Guid SensorId { get; set; }
    public decimal Value { get; set; }
    public DateTime DetectionDate { get; set; }

    // Navigation property
    public virtual SensorDto Sensor { get; set; } = null!;
} 