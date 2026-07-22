var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<SenseHatReader>();

var app = builder.Build();

app.MapSenseHatEndpoints();

app.Run("http://0.0.0.0:5000");
