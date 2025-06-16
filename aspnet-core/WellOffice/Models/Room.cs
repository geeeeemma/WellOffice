using System;

namespace WellOffice.Models;

public class Room
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Footage { get; set; }
    public decimal CeilingHeight { get; set; }

    // Navigation properties
    public virtual ICollection<Sensor> Sensors { get; set; } = new List<Sensor>();
    public virtual ICollection<Threshold> Thresholds { get; set; } = new List<Threshold>();
} 