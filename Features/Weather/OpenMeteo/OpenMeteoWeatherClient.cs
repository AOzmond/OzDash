using System.Globalization;
using System.Net.Http.Json;

namespace OzDash.Features.Weather.OpenMeteo;

public sealed class OpenMeteoWeatherClient(HttpClient httpClient)
{
    public async Task<CurrentWeatherReading> GetCurrentAsync(
        double latitude,
        double longitude,
        CancellationToken cancellationToken)
    {
        OpenMeteoForecastResponse? response = await httpClient.GetFromJsonAsync<OpenMeteoForecastResponse>(
            $"v1/forecast?latitude={latitude.ToString(CultureInfo.InvariantCulture)}&longitude={longitude.ToString(CultureInfo.InvariantCulture)}&current=temperature_2m,relative_humidity_2m&temperature_unit=celsius&timezone=auto&timeformat=iso8601",
            cancellationToken);

        OpenMeteoCurrentWeather current = response?.Current
            ?? throw new InvalidOperationException("Open-Meteo response did not include current weather data.");

        return new CurrentWeatherReading(
            TemperatureC: current.Temperature2M,
            HumidityPercent: current.RelativeHumidity2M);
    }
}
