using System;

namespace WellOffice.DTOs
{
    public class ThresholdDto
    {
        public Guid Id { get; set; }
        public Guid ParameterId { get; set; }
        public Guid RoomId { get; set; }
        public double OptimalMinValue { get; set; }
        public double OptimalMaxValue { get; set; }
        public double AcceptableMinValue { get; set; }
        public double AcceptableMaxValue { get; set; }
    }

    public class ThresholdDetailDto : ThresholdDto
    {
        public ParameterDto Parameter { get; set; }
        public RoomDto Room { get; set; }
    }
} 