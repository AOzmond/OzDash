using OzDash.Features.Weather.OpenMeteo;

namespace OzDash.Features.Weather;

public static class WeatherEndpoints
{
    public static IEndpointRouteBuilder MapWeatherEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/weather/current", GetCurrentWeatherAsync);

        return app;
    }

    private static async Task<IResult> GetCurrentWeatherAsync(
        string zipCode,
        OpenMeteoGeocodingClient geocodingClient,
        OpenMeteoWeatherClient weatherClient,
        CancellationToken cancellationToken)
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

        CurrentWeatherReading reading = await weatherClient.GetCurrentAsync(
            location.Latitude,
            location.Longitude,
            cancellationToken);

        return Results.Ok(new WeatherResponse(
            ZipCode: zipCode,
            Name: location.Name,
            CountryCode: location.CountryCode,
            TemperatureC: reading.TemperatureC,
            HumidityPercent: reading.HumidityPercent,
            WeatherCode: reading.WeatherCode,
            PrecipitationProbabilityPercent: reading.PrecipitationProbabilityPercent,
            WindSpeedMph: reading.WindSpeedMph));
    }
}
