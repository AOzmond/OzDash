using Iot.Device.SenseHat;
using UnitsNet;

namespace OzDash.Features.SenseHat;

public sealed class SenseHatReader : IDisposable
{
    private readonly Iot.Device.SenseHat.SenseHat _senseHat = new();
    private readonly Lock _gate = new();

    public SenseHatReading Read()
    {
        lock (_gate)
        {
            Temperature temperature1 = _senseHat.Temperature;
            Temperature temperature2 = _senseHat.Temperature2;
            Pressure pressure = _senseHat.Pressure;
            RelativeHumidity humidity = _senseHat.Humidity;

            return new SenseHatReading(
                TimestampUtc: DateTimeOffset.UtcNow,
                Temperature1C: temperature1.DegreesCelsius,
                Temperature2C: temperature2.DegreesCelsius,
                PressureHpa: pressure.Hectopascals,
                HumidityPercent: humidity.Percent);
        }
    }

    public void Dispose()
    {
        _senseHat.Dispose();
    }
}
