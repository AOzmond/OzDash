using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace OzDash;

public static class OpenMeteoEndpoints
{
    public static IEndpointRouteBuilder MapOpenMeteoEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/weather/current", async (
            string zipCode,
            OpenMeteoGeocodingClient geocodingClient,
            OpenMeteoWeatherClient client,
            CancellationToken cancellationToken) =>
        {
            if (string.IsNullOrWhiteSpace(zipCode))
            {
                return Results.BadRequest("Provide a ZIP code.");
            }

            OpenMeteoLocation? location = await geocodingClient.ResolveZipCodeAsync(zipCode, cancellationToken);

            if (location is null)
            {
                return Results.NotFound($"No location found for ZIP code '{zipCode}'.");
            }

            OpenMeteoCurrentWeatherReading reading = await client.GetCurrentAsync(
                location.Latitude,
                location.Longitude,
                cancellationToken);

            return Results.Ok(new OpenMeteoWeatherResponse(
                ZipCode: zipCode,
                Name: location.Name,
                CountryCode: location.CountryCode,
                TemperatureC: reading.TemperatureC,
                HumidityPercent: reading.HumidityPercent));
        });

        return app;
    }
}

public sealed class OpenMeteoGeocodingClient(HttpClient httpClient)
{
    public async Task<OpenMeteoLocation?> ResolveZipCodeAsync(string zipCode, CancellationToken cancellationToken)
    {
        OpenMeteoGeocodingResponse? response = await httpClient.GetFromJsonAsync<OpenMeteoGeocodingResponse>(
            $"v1/search?name={Uri.EscapeDataString(zipCode)}&count=10&countryCode=US&language=en&format=json",
            cancellationToken);

        OpenMeteoLocation? exactMatch = response?.Results?.FirstOrDefault(result =>
            result.Postcodes?.Contains(zipCode, StringComparer.OrdinalIgnoreCase) == true ||
            string.Equals(result.Name, zipCode, StringComparison.OrdinalIgnoreCase));

        return exactMatch ?? response?.Results?.FirstOrDefault();
    }
}

public sealed class OpenMeteoWeatherClient(HttpClient httpClient)
{
    public async Task<OpenMeteoCurrentWeatherReading> GetCurrentAsync(
        double latitude,
        double longitude,
        CancellationToken cancellationToken)
    {
        OpenMeteoForecastResponse? response = await httpClient.GetFromJsonAsync<OpenMeteoForecastResponse>(
            $"v1/forecast?latitude={latitude.ToString(CultureInfo.InvariantCulture)}&longitude={longitude.ToString(CultureInfo.InvariantCulture)}&current=temperature_2m,relative_humidity_2m&temperature_unit=celsius&timezone=auto&timeformat=iso8601",
            cancellationToken);

        OpenMeteoCurrentWeather? current = response?.Current
            ?? throw new InvalidOperationException("Open-Meteo response did not include current weather data.");

        return new OpenMeteoCurrentWeatherReading(
            TemperatureC: current.Temperature2M,
            HumidityPercent: current.RelativeHumidity2M);
    }
}

public sealed record OpenMeteoCurrentWeatherReading(
    double TemperatureC,
    double HumidityPercent);

public sealed record OpenMeteoWeatherResponse(
    string ZipCode,
    string Name,
    string CountryCode,
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
