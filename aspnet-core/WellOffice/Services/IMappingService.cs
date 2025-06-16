using WellOffice.Models;
using WellOffice.Models.DTOs;

namespace WellOffice.Services;

public interface IMappingService
{
    // Entity to DTO mappings
    RoomDto MapToDto(Room room);
    ParameterDto MapToDto(Parameter parameter);
    SensorDto MapToDto(Sensor sensor);
    SensorDataDto MapToDto(SensorData sensorData);
    ThresholdDto MapToDto(Threshold threshold);
    RemediationActionDto MapToDto(RemediationAction remediationAction);

    // DTO to Entity mappings
    Room MapToEntity(RoomDto roomDto);
    Parameter MapToEntity(ParameterDto parameterDto);
    Sensor MapToEntity(SensorDto sensorDto);
    SensorData MapToEntity(SensorDataDto sensorDataDto);
    Threshold MapToEntity(ThresholdDto thresholdDto);
    RemediationAction MapToEntity(RemediationActionDto remediationActionDto);

    // Collection mappings
    IEnumerable<RoomDto> MapToDto(IEnumerable<Room> rooms);
    IEnumerable<ParameterDto> MapToDto(IEnumerable<Parameter> parameters);
    IEnumerable<SensorDto> MapToDto(IEnumerable<Sensor> sensors);
    IEnumerable<SensorDataDto> MapToDto(IEnumerable<SensorData> sensorData);
    IEnumerable<ThresholdDto> MapToDto(IEnumerable<Threshold> thresholds);
    IEnumerable<RemediationActionDto> MapToDto(IEnumerable<RemediationAction> remediationActions);

    IEnumerable<Room> MapToEntity(IEnumerable<RoomDto> roomDtos);
    IEnumerable<Parameter> MapToEntity(IEnumerable<ParameterDto> parameterDtos);
    IEnumerable<Sensor> MapToEntity(IEnumerable<SensorDto> sensorDtos);
    IEnumerable<SensorData> MapToEntity(IEnumerable<SensorDataDto> sensorDataDtos);
    IEnumerable<Threshold> MapToEntity(IEnumerable<ThresholdDto> thresholdDtos);
    IEnumerable<RemediationAction> MapToEntity(IEnumerable<RemediationActionDto> remediationActionDtos);
} 