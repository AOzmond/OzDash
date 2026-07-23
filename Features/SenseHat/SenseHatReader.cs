using Iot.Device.SenseHat;
using Microsoft.Extensions.Options;
using UnitsNet;

namespace OzDash.Features.SenseHat;

public sealed class SenseHatReader(IOptions<SenseHatOptions> options) : IDisposable
{
    private readonly Iot.Device.SenseHat.SenseHat _senseHat = new();
    private readonly Lock _gate = new();
    private readonly double _temperatureOffsetCelsius = options.Value.TemperatureOffsetCelsius;

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
                Temperature1C: ApplyTemperatureCalibration(temperature1.DegreesCelsius),
                Temperature2C: ApplyTemperatureCalibration(temperature2.DegreesCelsius),
                PressureHpa: pressure.Hectopascals,
                HumidityPercent: humidity.Percent);
        }
    }

    private double ApplyTemperatureCalibration(double temperatureCelsius)
    {
        return temperatureCelsius + _temperatureOffsetCelsius;
    }

    public void Dispose()
    {
        _senseHat.Dispose();
    }
}
