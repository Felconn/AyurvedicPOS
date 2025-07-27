using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AyuPos.Web.Application.Interfaces;
using AyuPos.Web.Domain.Entities.Identity;
using AyuPos.Web.Infrastructure.Interceptors;
using AyuPos.Web.Infrastructure.Persistence;
using AyuPos.Web.Infrastructure.Services;

namespace AyuPos.Web.Infrastructure;

public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"), 
                b => b.MigrationsAssembly("AyuPos.Web.Infrastructure"));
            options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            options.LogTo(Console.WriteLine);
        });
        
        services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<AuditableEntitySaveChangesInterceptor>();
        
        // Add Identity services
        services.AddIdentity<AppIdentityUser, AppIdentityRole>(options =>
        {
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 4;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;
            options.User.RequireUniqueEmail = false;
        })
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();
        
        // Add JWT and Identity services
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        
        // Add database initializer
        services.AddScoped<IDatabaseInitializer, DatabaseInitializer>();
        
        return services;
    }
}