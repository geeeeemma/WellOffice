using System;
using System.Collections.Generic;

namespace WellOffice.DTOs
{
    public class EnvironmentSensorDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class EnvironmentParameterDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public double Value { get; set; }
        public string Unit { get; set; } = string.Empty;
        public string? Status { get; set; } // "optimal" | "borderline" | "critical" | null
        public ThresholdsDto Thresholds { get; set; } = new();
        public bool IsActive { get; set; }
        public ICollection<EnvironmentSensorDto> Sensors { get; set; } = new List<EnvironmentSensorDto>();
    }

    public class ThresholdsDto
    {
        public OptimalRangeDto Optimal { get; set; } = new();
        public BorderlineRangeDto Borderline { get; set; } = new();
    }

    public class OptimalRangeDto
    {
        public double Min { get; set; }
        public double Max { get; set; }
    }

    public class BorderlineRangeDto
    {
        public double Min { get; set; }
        public double Max { get; set; }
    }

    public class EnvironmentDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Stesso valore di Name
        public double Area { get; set; }
        public ICollection<EnvironmentParameterDto> Parameters { get; set; } = new List<EnvironmentParameterDto>();
        public string LastUpdated { get; set; } = string.Empty;
    }
}
