using Microsoft.EntityFrameworkCore;
using AyuPos.Standalone.Ui.Common.Entities.Identity;
using AyuPos.Standalone.Ui.Common.Constants;
using System.Security.Cryptography;
using System.Text;

namespace AyuPos.Standalone.Ui.Common;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<AppIdentityUser> Users { get; set; }
    public DbSet<AppIdentityRole> Roles { get; set; }
    public DbSet<AppIdentityUserRole> UserRoles { get; set; }
    public DbSet<AppIdentityUserPersonalData> UserPersonalData { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        ConfigureIdentityTables(builder);
        ConfigureUserPersonalData(builder);
        ConfigureUserRoleRelationships(builder);
        
        SeedRoles(builder);
        SeedUsers(builder);
        SeedUserRoles(builder);
    }

    private void ConfigureIdentityTables(ModelBuilder builder)
    {
        builder.Entity<AppIdentityUser>(b =>
        {
            b.ToTable("Users");
            b.HasKey(u => u.Id);
            b.HasIndex(u => u.NormalizedUserName).IsUnique();
            b.HasIndex(u => u.NormalizedEmail);
            
            b.HasMany(e => e.UserRoles)
                .WithOne(e => e.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();
        });

        builder.Entity<AppIdentityRole>(b =>
        {
            b.ToTable("Roles");
            b.HasKey(r => r.Id);
            b.HasIndex(r => r.NormalizedName).IsUnique();
            
            b.HasMany(e => e.UserRoles)
                .WithOne(e => e.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();
        });

        builder.Entity<AppIdentityUserRole>(b =>
        {
            b.ToTable("UserRoles");
            b.HasKey(r => new { r.UserId, r.RoleId });
        });
    }

    private void ConfigureUserPersonalData(ModelBuilder builder)
    {
        builder.Entity<AppIdentityUserPersonalData>(b =>
        {
            b.ToTable("UserPersonalData");
            b.HasKey(e => e.Id);
        });

        builder.Entity<AppIdentityUser>()
            .HasOne(u => u.UserPersonalData)
            .WithOne()
            .HasForeignKey<AppIdentityUserPersonalData>(p => p.Id)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private void ConfigureUserRoleRelationships(ModelBuilder builder)
    {
        builder.Entity<AppIdentityUserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        builder.Entity<AppIdentityUserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);
    }

    private void SeedRoles(ModelBuilder builder)
    {
        builder.Entity<AppIdentityRole>().HasData(
            new AppIdentityRole
            {
                Id = "1",
                Name = RoleConstant.SuperAdmin,
                NormalizedName = RoleConstant.SuperAdmin.ToUpper()
            },
            new AppIdentityRole
            {
                Id = "2", 
                Name = RoleConstant.Admin,
                NormalizedName = RoleConstant.Admin.ToUpper()
            },
            new AppIdentityRole
            {
                Id = "3",
                Name = RoleConstant.Cashier,
                NormalizedName = RoleConstant.Cashier.ToUpper()
            },
            new AppIdentityRole
            {
                Id = "4",
                Name = RoleConstant.Compounder,
                NormalizedName = RoleConstant.Compounder.ToUpper()
            }
        );
    }

    private void SeedUsers(ModelBuilder builder)
    {
        var adminUserId = "admin-user-id";
        var managerUserId = "manager-user-id";
        
        builder.Entity<AppIdentityUser>().HasData(
            new
            {
                Id = adminUserId,
                UserName = "admin@ayupos.com",
                NormalizedUserName = "ADMIN@AYUPOS.COM",
                Email = "admin@ayupos.com",
                NormalizedEmail = "ADMIN@AYUPOS.COM",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                IsDeactivated = false,
                InvitedAt = DateTimeOffset.UtcNow,
                PasswordHash = HashPassword("Admin@123"),
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                LockoutEnabled = false,
                AccessFailedCount = 0
            },
            new
            {
                Id = managerUserId,
                UserName = "manager@ayupos.com",
                NormalizedUserName = "MANAGER@AYUPOS.COM",
                Email = "manager@ayupos.com",
                NormalizedEmail = "MANAGER@AYUPOS.COM",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                IsDeactivated = false,
                InvitedAt = DateTimeOffset.UtcNow,
                PasswordHash = HashPassword("Manager@123"),
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                LockoutEnabled = false,
                AccessFailedCount = 0
            });
        
        builder.Entity<AppIdentityUserPersonalData>().HasData(
            new 
            {
                Id = adminUserId,
                FirstName = "System",
                LastName = "Administrator",
                PhoneNumber = (string?)null,
                Nic = (string?)null
            },
            new 
            {
                Id = managerUserId,
                FirstName = "Store",
                LastName = "Manager",
                PhoneNumber = (string?)null,
                Nic = (string?)null
            }
        );
    }

    private void SeedUserRoles(ModelBuilder builder)
    {
        builder.Entity<AppIdentityUserRole>().HasData(
            new AppIdentityUserRole
            {
                UserId = "admin-user-id",
                RoleId = "1"
            },
            new AppIdentityUserRole
            {
                UserId = "manager-user-id",
                RoleId = "2"
            }
        );
    }
    
    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "AyuPosSalt"));
        return Convert.ToBase64String(hashedBytes);
    }
}