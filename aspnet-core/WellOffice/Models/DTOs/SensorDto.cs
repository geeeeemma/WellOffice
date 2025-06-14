using System;

namespace WellOffice.Models.DTOs;

public class SensorDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid ParameterId { get; set; }
    public Guid RoomId { get; set; }
    public bool IsActive { get; set; }

    // Navigation properties
    public virtual ParameterDto Parameter { get; set; } = null!;
    public virtual RoomDto Room { get; set; } = null!;
    public virtual ICollection<SensorDataDto> SensorData { get; set; } = new List<SensorDataDto>();
    public virtual ICollection<RemediationActionDto> RemediationActions { get; set; } = new List<RemediationActionDto>();
} 