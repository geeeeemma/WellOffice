using System;

namespace WellOffice.Models;

public class RemediationAction
{
    public Guid Id { get; set; }
    public Guid SensorId { get; set; }
    public string Action { get; set; } = string.Empty;
    public DateTime ActionDate { get; set; }

    // Navigation property
    public virtual Sensor Sensor { get; set; } = null!;
} 