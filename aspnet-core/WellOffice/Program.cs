using Microsoft.EntityFrameworkCore;
using WellOffice.Data;
using WellOffice.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Rimuovo ReferenceHandler.Preserve per evitare $id/$values
        // options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Configure DbContext
builder.Services.AddDbContext<WellOfficeContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register services
builder.Services.AddScoped<IMappingService, MappingService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IParameterService, ParameterService>();
builder.Services.AddScoped<ISensorService, SensorService>();
builder.Services.AddScoped<ISensorDataService, SensorDataService>();
builder.Services.AddScoped<IThresholdService, ThresholdService>();
builder.Services.AddScoped<IRemediationActionService, RemediationActionService>();
builder.Services.AddScoped<IEnvironmentService, EnvironmentService>();

// Configure CORS - Allow all origins, methods, and headers
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod() 
              .AllowAnyHeader();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
