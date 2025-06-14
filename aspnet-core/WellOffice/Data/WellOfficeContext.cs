using Microsoft.EntityFrameworkCore;
using WellOffice.Models;

namespace WellOffice.Data;

public class WellOfficeContext : DbContext
{
    public WellOfficeContext(DbContextOptions<WellOfficeContext> options)
        : base(options)
    {
    }

    public DbSet<Room> Rooms { get; set; } = null!;
    public DbSet<Parameter> Parameters { get; set; } = null!;
    public DbSet<Sensor> Sensors { get; set; } = null!;
    public DbSet<SensorData> SensorData { get; set; } = null!;
    public DbSet<Threshold> Thresholds { get; set; } = null!;
    public DbSet<RemediationAction> RemediationActions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Room
        modelBuilder.Entity<Room>()
            .HasMany(r => r.Sensors)
            .WithOne(s => s.Room)
            .HasForeignKey(s => s.RoomId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Room>()
            .HasMany(r => r.Thresholds)
            .WithOne(t => t.Room)
            .HasForeignKey(t => t.RoomId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Parameter
        modelBuilder.Entity<Parameter>()
            .HasMany(p => p.Sensors)
            .WithOne(s => s.Parameter)
            .HasForeignKey(s => s.ParameterId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Parameter>()
            .HasMany(p => p.Thresholds)
            .WithOne(t => t.Parameter)
            .HasForeignKey(t => t.ParameterId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Sensor
        modelBuilder.Entity<Sensor>()
            .HasMany(s => s.SensorData)
            .WithOne(sd => sd.Sensor)
            .HasForeignKey(sd => sd.SensorId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Sensor>()
            .HasMany(s => s.RemediationActions)
            .WithOne(ra => ra.Sensor)
            .HasForeignKey(ra => ra.SensorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
} 