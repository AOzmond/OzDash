namespace OzDash.Features.SenseHat;

public sealed record SenseHatReading(
    DateTimeOffset TimestampUtc,
    double Temperature1C,
    double Temperature2C,
    double PressureHpa,
    double HumidityPercent);
