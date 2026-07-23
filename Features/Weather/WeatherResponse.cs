namespace OzDash.Features.Weather;

public sealed record WeatherResponse(
    string ZipCode,
    string Name,
    string CountryCode,
    double TemperatureC,
    double HumidityPercent,
    int WeatherCode,
    double PrecipitationProbabilityPercent,
    double WindSpeedMph);
