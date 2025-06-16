using System;

namespace WellOffice.Models;

public class Threshold
{
    public Guid Id { get; set; }
    public Guid ParameterId { get; set; }
    public Guid RoomId { get; set; }
    public decimal OptimalMinValue { get; set; }
    public decimal OptimalMaxValue { get; set; }
    public decimal AcceptableMinValue { get; set; }
    public decimal AcceptableMaxValue { get; set; }

    // Navigation properties
    public virtual Parameter Parameter { get; set; } = null!;
    public virtual Room Room { get; set; } = null!;
} 