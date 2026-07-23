using OzDash.Features.Weather.OpenMeteo;

namespace OzDash.Features.Weather;

public static class WeatherServiceCollectionExtensions
{
    public static IServiceCollection AddWeatherFeature(this IServiceCollection services)
    {
        services.AddHttpClient<OpenMeteoWeatherClient>(client =>
        {
            client.BaseAddress = new Uri("https://api.open-meteo.com/");
        });
        services.AddHttpClient<OpenMeteoGeocodingClient>(client =>
        {
            client.BaseAddress = new Uri("https://geocoding-api.open-meteo.com/");
        });

        return services;
    }
}
