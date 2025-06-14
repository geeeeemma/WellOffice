using System;
using System.Collections.Generic;

namespace WellOffice.DTOs
{
    public class ParameterDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int UnitMeasure { get; set; }
    }

    public class ParameterDetailDto : ParameterDto
    {
        public ICollection<SensorDto> Sensors { get; set; }
    }
} 