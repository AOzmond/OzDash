using System.Net.Http.Json;

namespace OzDash.Features.Weather.OpenMeteo;

public sealed class OpenMeteoGeocodingClient(HttpClient httpClient)
{
    public async Task<OpenMeteoLocation?> ResolveZipCodeAsync(
        string zipCode,
        CancellationToken cancellationToken)
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
