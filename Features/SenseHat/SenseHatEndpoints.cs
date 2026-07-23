namespace OzDash.Features.SenseHat;

public static class SenseHatEndpoints
{
    public static IEndpointRouteBuilder MapSenseHatEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/sensehat", (SenseHatReader reader) => Results.Ok(reader.Read()));

        return app;
    }
}
