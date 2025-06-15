using System;

namespace WellOffice.Models;

public class Sensor
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? ParameterId { get; set; }
    public Guid? RoomId { get; set; }
    public bool IsActive { get; set; }

    // Navigation properties
    public virtual Parameter? Parameter { get; set; } = null!;
    public virtual Room? Room { get; set; } = null!;
    public virtual ICollection<SensorData> SensorData { get; set; } = new List<SensorData>();
    public virtual ICollection<RemediationAction> RemediationActions { get; set; } = new List<RemediationAction>();
} 