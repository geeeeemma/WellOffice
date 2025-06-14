using System;

namespace WellOffice.Models;

public class SensorData
{
    public Guid Id { get; set; }
    public Guid SensorId { get; set; }
    public decimal Value { get; set; }
    public DateTime DetectionDate { get; set; }

    // Navigation property
    public virtual Sensor Sensor { get; set; } = null!;
} 