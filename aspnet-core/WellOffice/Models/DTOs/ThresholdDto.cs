using System;

namespace WellOffice.Models.DTOs;

public class ThresholdDto
{
    public Guid Id { get; set; }
    public Guid ParameterId { get; set; }
    public Guid RoomId { get; set; }
    public decimal OptimalMinValue { get; set; }
    public decimal OptimalMaxValue { get; set; }
    public decimal AcceptableMinValue { get; set; }
    public decimal AcceptableMaxValue { get; set; }

    // Navigation properties
    public virtual ParameterDto Parameter { get; set; } = null!;
    public virtual RoomDto Room { get; set; } = null!;
} 