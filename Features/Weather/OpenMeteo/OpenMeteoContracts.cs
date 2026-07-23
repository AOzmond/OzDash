using System.Text.Json.Serialization;

namespace OzDash.Features.Weather.OpenMeteo;

public sealed record CurrentWeatherReading(
    double TemperatureC,
    double HumidityPercent);

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
}

public sealed class OpenMeteoCurrentWeather
{
    [JsonPropertyName("temperature_2m")]
    public double Temperature2M { get; init; }

    [JsonPropertyName("relative_humidity_2m")]
    public double RelativeHumidity2M { get; init; }
}
