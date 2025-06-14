using WellOffice.Models;

namespace WellOffice.Services;

public interface IParameterService : IBaseService<Parameter>
{
    Task<IEnumerable<Parameter>> GetParametersWithSensorsAsync();
    Task<IEnumerable<Parameter>> GetParametersWithThresholdsAsync();
} 