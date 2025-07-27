using AyuPos.Web.Application.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace AyuPos.Web.Application;

public static class ConfigureServices
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediator(options =>
        {
            options.ServiceLifetime = ServiceLifetime.Scoped;
        });
        
        return services;
    }
    
    public static void SeedRoles(this IServiceCollection services)
    {
        // This method can be used to seed initial data if needed
        // For example, you can add a hosted service that seeds the database
        // or call a seeding method directly here.
        
        var serviceProvider = services.BuildServiceProvider();
        using (var scope = serviceProvider.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<IAppDbContext>();
            // Add seeding logic here if needed
        }
    }
}