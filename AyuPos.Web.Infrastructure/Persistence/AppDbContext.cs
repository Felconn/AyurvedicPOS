using System.Reflection;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using AyuPos.Web.Application.Common.Constants;
using AyuPos.Web.Application.Interfaces;
using AyuPos.Web.Domain.Entities.Identity;
using AyuPos.Web.Infrastructure.Interceptors;

namespace AyuPos.Web.Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<
    AppIdentityUser,
    AppIdentityRole,
    string,
    IdentityUserClaim<string>,
    AppIdentityUserRole,
    IdentityUserLogin<string>,
    IdentityRoleClaim<string>,
    IdentityUserToken<string>>, IAppDbContext
{
    private readonly AuditableEntitySaveChangesInterceptor _auditableEntitySaveChangesInterceptor;
    private readonly ILogger<AppDbContext> _logger;
    private readonly IMediator _mediator;
    
    public AppDbContext(DbContextOptions options,
        IMediator mediator,
        AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor, ILogger<AppDbContext> logger) : base(options)
    {
        _mediator = mediator;
        _auditableEntitySaveChangesInterceptor = auditableEntitySaveChangesInterceptor;
        _logger = logger;
    }
    
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppIdentityUser>().ToTable("Identity365User")
            .Navigation(x=>x.UserPersonalData)
            .AutoInclude();
        
        builder.Entity<AppIdentityUserPersonalData>().ToTable("Identity365UserPersonalData");

        builder.Entity<AppIdentityRole>().ToTable("Identity365Role");

        builder.Entity<AppIdentityUserRole>().ToTable("Identity365UserRole");

        builder.Entity<IdentityRoleClaim<string>>().ToTable("Identity365RoleClaim");

        builder.Entity<IdentityUserToken<string>>().ToTable("Identity365UserToken");

        builder.Entity<IdentityUserClaim<string>>().ToTable("Identity365UserClaim");

        builder.Entity<IdentityUserLogin<string>>().ToTable("Identity365UserLogin");

        builder.Entity<AppIdentityUserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        builder.Entity<AppIdentityUserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired();

        builder.Entity<AppIdentityUserRole>()
            .HasOne(ur => ur.User)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();
        

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
    
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _mediator.DispatchDomainEvents(this);

        return await base.SaveChangesAsync(cancellationToken);
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(_auditableEntitySaveChangesInterceptor);
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
        }
    }
}