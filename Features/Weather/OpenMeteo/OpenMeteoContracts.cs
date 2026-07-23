using System.Text.Json.Serialization;

namespace OzDash.Features.Weather.OpenMeteo;

public sealed record CurrentWeatherReading(
    double TemperatureC,
    double HumidityPercent,
    int WeatherCode,
    double PrecipitationProbabilityPercent,
    double WindSpeedMph);

public sealed class OpenMeteoGeocodingResponse
{
    [JsonPropertyName("results")]
    public List<OpenMeteoLocation>? Results { get; init; }
}

public sealed class OpenMeteoLocation
{
    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("latitude")]
    public double Latitude { get; init; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; init; }

    [JsonPropertyName("country_code")]
    public string CountryCode { get; init; } = string.Empty;

    [JsonPropertyName("postcodes")]
    public List<string>? Postcodes { get; init; }
}

public sealed class OpenMeteoForecastResponse
{
    [JsonPropertyName("current")]
    public OpenMeteoCurrentWeather? Current { get; init; }

    [JsonPropertyName("hourly")]
    public OpenMeteoHourlyWeather? Hourly { get; init; }
}

public sealed class OpenMeteoCurrentWeather
{
    [JsonPropertyName("time")]
    public string Time { get; init; } = string.Empty;

    [JsonPropertyName("temperature_2m")]
    public double Temperature2M { get; init; }

    [JsonPropertyName("relative_humidity_2m")]
    public double RelativeHumidity2M { get; init; }

    [JsonPropertyName("weather_code")]
    public int WeatherCode { get; init; }

    [JsonPropertyName("wind_speed_10m")]
    public double WindSpeed10M { get; init; }
}

public sealed class OpenMeteoHourlyWeather
{
    [JsonPropertyName("time")]
    public List<string> Time { get; init; } = [];

    [JsonPropertyName("precipitation_probability")]
    public List<double> PrecipitationProbability { get; init; } = [];
}
