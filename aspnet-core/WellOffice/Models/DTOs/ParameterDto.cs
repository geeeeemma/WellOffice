using System;

namespace WellOffice.Models.DTOs;

public class ParameterDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public UnitMeasure UnitMeasure { get; set; }

    // Navigation properties
    public virtual ICollection<SensorDto> Sensors { get; set; } = new List<SensorDto>();
    public virtual ICollection<ThresholdDto> Thresholds { get; set; } = new List<ThresholdDto>();
} 