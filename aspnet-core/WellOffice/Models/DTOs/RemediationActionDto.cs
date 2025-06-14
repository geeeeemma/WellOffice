using System;

namespace WellOffice.Models.DTOs;

public class RemediationActionDto
{
    public Guid Id { get; set; }
    public Guid SensorId { get; set; }
    public string Action { get; set; } = string.Empty;
    public DateTime ActionDate { get; set; }

    // Navigation property
    public virtual SensorDto Sensor { get; set; } = null!;
} 