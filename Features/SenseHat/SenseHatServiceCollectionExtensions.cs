namespace OzDash.Features.SenseHat;

public static class SenseHatServiceCollectionExtensions
{
    public static IServiceCollection AddSenseHatFeature(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<SenseHatOptions>(configuration.GetSection(SenseHatOptions.SectionName));
        services.AddSingleton<SenseHatReader>();

        return services;
    }
}
