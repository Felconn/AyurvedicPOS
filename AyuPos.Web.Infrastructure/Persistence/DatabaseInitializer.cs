using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using AyuPos.Web.Application.Common.Constants;
using AyuPos.Web.Domain.Entities.Identity;

namespace AyuPos.Web.Infrastructure.Persistence;

public interface IDatabaseInitializer
{
    Task InitializeAsync();
}

public class DatabaseInitializer : IDatabaseInitializer
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DatabaseInitializer> _logger;

    public DatabaseInitializer(IServiceProvider serviceProvider, ILogger<DatabaseInitializer> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        
        // Apply pending migrations
        await dbContext.Database.MigrateAsync();
        
        // Seed roles
        await SeedRolesAsync(scope.ServiceProvider);
        
        // Seed superadmin user
        await SeedSuperAdminAsync(scope.ServiceProvider);
    }

    private async Task SeedRolesAsync(IServiceProvider serviceProvider)
    {
        try
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<AppIdentityRole>>();
            
            var roles = new[]
            {
                RoleConstant.SuperAdmin,
                RoleConstant.Admin,
                RoleConstant.Cashier,
                RoleConstant.Compounder
            };

            foreach (var roleName in roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    var role = new AppIdentityRole(roleName)
                    {
                        NormalizedName = roleName.ToUpperInvariant()
                    };
                    
                    var result = await roleManager.CreateAsync(role);
                    
                    if (result.Succeeded)
                    {
                        _logger.LogInformation("Role {RoleName} created successfully", roleName);
                    }
                    else
                    {
                        _logger.LogError("Failed to create role {RoleName}: {Errors}", 
                            roleName, 
                            string.Join(", ", result.Errors.Select(e => e.Description)));
                    }
                }
                else
                {
                    _logger.LogInformation("Role {RoleName} already exists", roleName);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding roles");
            throw;
        }
    }
    
    private async Task SeedSuperAdminAsync(IServiceProvider serviceProvider)
    {
        try
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<AppIdentityUser>>();
            
            // Default superadmin credentials
            const string superAdminUserName = "superadmin";
            const string superAdminPassword = "SuperAdmin@123";
            const string superAdminFirstName = "Super";
            const string superAdminLastName = "Admin";
            const string superAdminNic = "999999999V";
            const string superAdminPhone = "0777777777";
            
            // Check if superadmin user already exists
            var existingUser = await userManager.FindByNameAsync(superAdminUserName);
            if (existingUser == null)
            {
                // Create superadmin user
                var superAdminUser = new AppIdentityUser(
                    superAdminUserName,
                    superAdminFirstName,
                    superAdminLastName,
                    superAdminPhone,
                    superAdminNic
                );
                
                superAdminUser.Email = "superadmin@ayupos.com";
                superAdminUser.EmailConfirmed = true;
                
                var createResult = await userManager.CreateAsync(superAdminUser, superAdminPassword);
                
                if (createResult.Succeeded)
                {
                    // Assign SuperAdmin role
                    var roleResult = await userManager.AddToRoleAsync(superAdminUser, RoleConstant.SuperAdmin);
                    
                    if (roleResult.Succeeded)
                    {
                        _logger.LogInformation("SuperAdmin user created successfully with username: {UserName}", superAdminUserName);
                    }
                    else
                    {
                        _logger.LogError("Failed to assign SuperAdmin role: {Errors}", 
                            string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                    }
                }
                else
                {
                    _logger.LogError("Failed to create SuperAdmin user: {Errors}", 
                        string.Join(", ", createResult.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                _logger.LogInformation("SuperAdmin user already exists with username: {UserName}", superAdminUserName);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding SuperAdmin user");
            throw;
        }
    }
}