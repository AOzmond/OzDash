using OzDash;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<SenseHatReader>();

WebApplication app = builder.Build();

app.MapSenseHatEndpoints();

app.Run("http://0.0.0.0:5000");
