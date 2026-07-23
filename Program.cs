using OzDash;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<SenseHatReader>();
builder.Services.AddHttpClient<OpenMeteoWeatherClient>(client =>
{
    client.BaseAddress = new Uri("https://api.open-meteo.com/");
});
builder.Services.AddHttpClient<OpenMeteoGeocodingClient>(client =>
{
    client.BaseAddress = new Uri("https://geocoding-api.open-meteo.com/");
});

WebApplication app = builder.Build();

app.MapSenseHatEndpoints();
app.MapOpenMeteoEndpoints();

app.Run("http://0.0.0.0:5000");
