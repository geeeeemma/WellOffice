using AutoMapper;
using WellOffice.Models;
using WellOffice.Models.DTOs;

namespace WellOffice.Services;

public class MappingService : IMappingService
{
    private readonly IMapper _mapper;

    public MappingService(IMapper mapper)
    {
        _mapper = mapper;
    }

    // Entity to DTO mappings
    public RoomDto MapToDto(Room room) => _mapper.Map<RoomDto>(room);
    public ParameterDto MapToDto(Parameter parameter) => _mapper.Map<ParameterDto>(parameter);
    public SensorDto MapToDto(Sensor sensor) => _mapper.Map<SensorDto>(sensor);
    public SensorDataDto MapToDto(SensorData sensorData) => _mapper.Map<SensorDataDto>(sensorData);
    public ThresholdDto MapToDto(Threshold threshold) => _mapper.Map<ThresholdDto>(threshold);
    public RemediationActionDto MapToDto(RemediationAction remediationAction) => _mapper.Map<RemediationActionDto>(remediationAction);

    // DTO to Entity mappings
    public Room MapToEntity(RoomDto roomDto) => _mapper.Map<Room>(roomDto);
    public Parameter MapToEntity(ParameterDto parameterDto) => _mapper.Map<Parameter>(parameterDto);
    public Sensor MapToEntity(SensorDto sensorDto) => _mapper.Map<Sensor>(sensorDto);
    public SensorData MapToEntity(SensorDataDto sensorDataDto) => _mapper.Map<SensorData>(sensorDataDto);
    public Threshold MapToEntity(ThresholdDto thresholdDto) => _mapper.Map<Threshold>(thresholdDto);
    public RemediationAction MapToEntity(RemediationActionDto remediationActionDto) => _mapper.Map<RemediationAction>(remediationActionDto);

    // Collection mappings
    public IEnumerable<RoomDto> MapToDto(IEnumerable<Room> rooms) => _mapper.Map<IEnumerable<RoomDto>>(rooms);
    public IEnumerable<ParameterDto> MapToDto(IEnumerable<Parameter> parameters) => _mapper.Map<IEnumerable<ParameterDto>>(parameters);
    public IEnumerable<SensorDto> MapToDto(IEnumerable<Sensor> sensors) => _mapper.Map<IEnumerable<SensorDto>>(sensors);
    public IEnumerable<SensorDataDto> MapToDto(IEnumerable<SensorData> sensorData) => _mapper.Map<IEnumerable<SensorDataDto>>(sensorData);
    public IEnumerable<ThresholdDto> MapToDto(IEnumerable<Threshold> thresholds) => _mapper.Map<IEnumerable<ThresholdDto>>(thresholds);
    public IEnumerable<RemediationActionDto> MapToDto(IEnumerable<RemediationAction> remediationActions) => _mapper.Map<IEnumerable<RemediationActionDto>>(remediationActions);

    public IEnumerable<Room> MapToEntity(IEnumerable<RoomDto> roomDtos) => _mapper.Map<IEnumerable<Room>>(roomDtos);
    public IEnumerable<Parameter> MapToEntity(IEnumerable<ParameterDto> parameterDtos) => _mapper.Map<IEnumerable<Parameter>>(parameterDtos);
    public IEnumerable<Sensor> MapToEntity(IEnumerable<SensorDto> sensorDtos) => _mapper.Map<IEnumerable<Sensor>>(sensorDtos);
    public IEnumerable<SensorData> MapToEntity(IEnumerable<SensorDataDto> sensorDataDtos) => _mapper.Map<IEnumerable<SensorData>>(sensorDataDtos);
    public IEnumerable<Threshold> MapToEntity(IEnumerable<ThresholdDto> thresholdDtos) => _mapper.Map<IEnumerable<Threshold>>(thresholdDtos);
    public IEnumerable<RemediationAction> MapToEntity(IEnumerable<RemediationActionDto> remediationActionDtos) => _mapper.Map<IEnumerable<RemediationAction>>(remediationActionDtos);
} 