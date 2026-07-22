using Iot.Device.SenseHat;
using UnitsNet;

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
    private readonly SenseHat senseHat = new();
    private readonly object gate = new();

    public SenseHatReading Read()
    {
        lock (gate)
        {
            var tempValue = senseHat.Temperature;
            var temp2Value = senseHat.Temperature2;
            var pressureValue = senseHat.Pressure;
            var humidityValue = senseHat.Humidity;

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
        senseHat.Dispose();
    }
}

public sealed record SenseHatReading(
    DateTimeOffset TimestampUtc,
    double Temperature1C,
    double Temperature2C,
    double PressureHpa,
    double HumidityPercent);
