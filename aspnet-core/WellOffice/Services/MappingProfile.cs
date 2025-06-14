using AutoMapper;
using WellOffice.Models;
using WellOffice.Models.DTOs;

namespace WellOffice.Services;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Room mappings
        CreateMap<Room, RoomDto>()
            .ForMember(dest => dest.Sensors, opt => opt.MapFrom(src => src.Sensors))
            .ForMember(dest => dest.Thresholds, opt => opt.MapFrom(src => src.Thresholds));
        CreateMap<RoomDto, Room>()
            .ForMember(dest => dest.Sensors, opt => opt.MapFrom(src => src.Sensors))
            .ForMember(dest => dest.Thresholds, opt => opt.MapFrom(src => src.Thresholds));

        // Parameter mappings
        CreateMap<Parameter, ParameterDto>()
            .ForMember(dest => dest.Sensors, opt => opt.MapFrom(src => src.Sensors))
            .ForMember(dest => dest.Thresholds, opt => opt.MapFrom(src => src.Thresholds));
        CreateMap<ParameterDto, Parameter>()
            .ForMember(dest => dest.Sensors, opt => opt.MapFrom(src => src.Sensors))
            .ForMember(dest => dest.Thresholds, opt => opt.MapFrom(src => src.Thresholds));

        // Sensor mappings
        CreateMap<Sensor, SensorDto>()
            .ForMember(dest => dest.Parameter, opt => opt.MapFrom(src => src.Parameter))
            .ForMember(dest => dest.Room, opt => opt.MapFrom(src => src.Room))
            .ForMember(dest => dest.SensorData, opt => opt.MapFrom(src => src.SensorData))
            .ForMember(dest => dest.RemediationActions, opt => opt.MapFrom(src => src.RemediationActions));
        CreateMap<SensorDto, Sensor>()
            .ForMember(dest => dest.Parameter, opt => opt.MapFrom(src => src.Parameter))
            .ForMember(dest => dest.Room, opt => opt.MapFrom(src => src.Room))
            .ForMember(dest => dest.SensorData, opt => opt.MapFrom(src => src.SensorData))
            .ForMember(dest => dest.RemediationActions, opt => opt.MapFrom(src => src.RemediationActions));

        // SensorData mappings
        CreateMap<SensorData, SensorDataDto>()
            .ForMember(dest => dest.Sensor, opt => opt.MapFrom(src => src.Sensor));
        CreateMap<SensorDataDto, SensorData>()
            .ForMember(dest => dest.Sensor, opt => opt.MapFrom(src => src.Sensor));

        // Threshold mappings
        CreateMap<Threshold, ThresholdDto>()
            .ForMember(dest => dest.Parameter, opt => opt.MapFrom(src => src.Parameter))
            .ForMember(dest => dest.Room, opt => opt.MapFrom(src => src.Room));
        CreateMap<ThresholdDto, Threshold>()
            .ForMember(dest => dest.Parameter, opt => opt.MapFrom(src => src.Parameter))
            .ForMember(dest => dest.Room, opt => opt.MapFrom(src => src.Room));

        // RemediationAction mappings
        CreateMap<RemediationAction, RemediationActionDto>()
            .ForMember(dest => dest.Sensor, opt => opt.MapFrom(src => src.Sensor));
        CreateMap<RemediationActionDto, RemediationAction>()
            .ForMember(dest => dest.Sensor, opt => opt.MapFrom(src => src.Sensor));
    }
} 