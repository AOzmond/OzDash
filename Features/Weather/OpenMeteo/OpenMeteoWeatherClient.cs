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
            $"v1/forecast?latitude={latitude.ToString(CultureInfo.InvariantCulture)}&longitude={longitude.ToString(CultureInfo.InvariantCulture)}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=precipitation_probability&forecast_days=1&temperature_unit=celsius&wind_speed_unit=mph&timezone=auto&timeformat=iso8601",
            cancellationToken);

        OpenMeteoCurrentWeather current = response?.Current
            ?? throw new InvalidOperationException("Open-Meteo response did not include current weather data.");
        OpenMeteoHourlyWeather hourly = response.Hourly
            ?? throw new InvalidOperationException("Open-Meteo response did not include hourly weather data.");

        string currentHour = current.Time.Length >= 13 ? current.Time[..13] : current.Time;
        int currentHourIndex = hourly.Time.FindIndex(time =>
            time.StartsWith(currentHour, StringComparison.Ordinal));

        if (currentHourIndex < 0 || currentHourIndex >= hourly.PrecipitationProbability.Count)
        {
            throw new InvalidOperationException("Open-Meteo response did not include the current rain probability.");
        }

        return new CurrentWeatherReading(
            TemperatureC: current.Temperature2M,
            HumidityPercent: current.RelativeHumidity2M,
            WeatherCode: current.WeatherCode,
            PrecipitationProbabilityPercent: hourly.PrecipitationProbability[currentHourIndex],
            WindSpeedMph: current.WindSpeed10M);
    }
}
