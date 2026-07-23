namespace OzDash.Features.SenseHat;

public static class SenseHatServiceCollectionExtensions
{
    public static IServiceCollection AddSenseHatFeature(this IServiceCollection services)
    {
        services.AddSingleton<SenseHatReader>();

        return services;
    }
}
