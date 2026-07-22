using Iot.Device.SenseHat;
using UnitsNet;

namespace OzDash;

public static class SenseHatEndpoints
{
    public static IEndpointRouteBuilder MapSenseHatEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/sensehat", (SenseHatReader reader) => Results.Ok(reader.Read()));
        return app;
    }
}

public sealed class SenseHatReader : IDisposable
{
    private readonly SenseHat _senseHat = new();
    private readonly Lock _gate = new();

    public SenseHatReading Read()
    {
        lock (_gate)
        {
            Temperature tempValue = _senseHat.Temperature;
            Temperature temp2Value = _senseHat.Temperature2;
            Pressure pressureValue = _senseHat.Pressure;
            RelativeHumidity humidityValue = _senseHat.Humidity;

            return new SenseHatReading(
                TimestampUtc: DateTimeOffset.UtcNow,
                Temperature1C: tempValue.DegreesCelsius,
                Temperature2C: temp2Value.DegreesCelsius,
                PressureHpa: pressureValue.Hectopascals,
                HumidityPercent: humidityValue.Percent);
        }
    }

    public void Dispose()
    {
        _senseHat.Dispose();
    }
}

public sealed record SenseHatReading(
    DateTimeOffset TimestampUtc,
    double Temperature1C,
    double Temperature2C,
    double PressureHpa,
    double HumidityPercent);
