using OzDash.Features.SenseHat;
using OzDash.Features.Weather;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddSenseHatFeature(builder.Configuration);
builder.Services.AddWeatherFeature();

WebApplication app = builder.Build();

app.MapSenseHatEndpoints();
app.MapWeatherEndpoints();

app.Run("http://0.0.0.0:5000");
