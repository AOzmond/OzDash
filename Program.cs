using Iot.Device.Common;
using Iot.Device.SenseHat;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var defaultSeaLevelPressure = WeatherHelper.MeanSeaLevel;
using var senseHat = new SenseHat();
var senseHatLock = new object();

app.MapGet("/api/sensehat", () =>
{
    lock (senseHatLock)
    {
        var tempValue = senseHat.Temperature;
        var temp2Value = senseHat.Temperature2;
        var pressureValue = senseHat.Pressure;
        var humidityValue = senseHat.Humidity;
        var accelerationValue = senseHat.Acceleration;
        var angularRateValue = senseHat.AngularRate;
        var magneticInductionValue = senseHat.MagneticInduction;
        var altitudeValue = WeatherHelper.CalculateAltitude(
            pressureValue,
            defaultSeaLevelPressure,
            tempValue);

        return Results.Ok(new SenseHatReading(
            TimestampUtc: DateTimeOffset.UtcNow,
            Temperature1C: tempValue.DegreesCelsius,
            Temperature2C: temp2Value.DegreesCelsius,
            PressureHpa: pressureValue.Hectopascals,
            AltitudeM: altitudeValue.Meters,
            Acceleration: accelerationValue.ToString(),
            AngularRate: angularRateValue.ToString(),
            MagneticInduction: magneticInductionValue.ToString(),
            HumidityPercent: humidityValue.Percent,
            HeatIndexC: WeatherHelper.CalculateHeatIndex(tempValue, humidityValue).DegreesCelsius,
            DewPointC: WeatherHelper.CalculateDewPoint(tempValue, humidityValue).DegreesCelsius));
    }
});

app.Run("http://0.0.0.0:5000");

public sealed record SenseHatReading(
    DateTimeOffset TimestampUtc,
    double Temperature1C,
    double Temperature2C,
    double PressureHpa,
    double AltitudeM,
    string Acceleration,
    string AngularRate,
    string MagneticInduction,
    double HumidityPercent,
    double HeatIndexC,
    double DewPointC);
