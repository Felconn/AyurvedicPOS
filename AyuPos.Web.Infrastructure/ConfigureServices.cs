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
    public static void ConfigureDbContextOptions(DbContextOptionsBuilder options, string connectionString)
    {
        options.UseNpgsql(connectionString, 
            b => b.MigrationsAssembly("AyuPos.Web.Api"));
        options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
        options.LogTo(Console.WriteLine);
    }
    
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            ConfigureDbContextOptions(options, configuration.GetConnectionString("DefaultConnection"));
        });
        
        services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<AuditableEntitySaveChangesInterceptor>();
        
        services.AddIdentityCore<AppIdentityUser>(options =>
        {
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 4;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;
            options.User.RequireUniqueEmail = false;
        })
        .AddRoles<AppIdentityRole>()
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders()
        .AddUserManager<UserManager<AppIdentityUser>>()
        .AddRoleManager<RoleManager<AppIdentityRole>>();
        
        // Add JWT and Identity services
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        
        // Add database initializer
        services.AddScoped<IDatabaseInitializer, DatabaseInitializer>();
        
        return services;
    }
}