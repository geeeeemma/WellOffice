using System;

namespace WellOffice.Models;

public class Parameter
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string UnitMeasure { get; set; }

    // Navigation properties
    public virtual ICollection<Sensor> Sensors { get; set; } = new List<Sensor>();
    public virtual ICollection<Threshold> Thresholds { get; set; } = new List<Threshold>();
} 