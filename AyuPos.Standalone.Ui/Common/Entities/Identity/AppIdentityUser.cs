using System.ComponentModel.DataAnnotations;

namespace AyuPos.Standalone.Ui.Common.Entities.Identity;

public class AppIdentityUser : BaseEntity
{
    public AppIdentityUser()
    {
        UserRoles = new List<AppIdentityUserRole>();
        InvitedAt = DateTimeOffset.UtcNow;
        SecurityStamp = Guid.NewGuid().ToString();
    }

    public AppIdentityUser(string userId) : this()
    {
        Id = userId;
        UserName = userId;
    }
    
    public AppIdentityUser(string userId, string? firstName, string? lastName, string? phoneNumber, string? nic) : this(userId)
    {
        UserPersonalData = new AppIdentityUserPersonalData(Id, firstName, lastName, phoneNumber, nic);
    }
    
    [Required]
    [StringLength(256)]
    public string UserName { get; set; } = string.Empty;
    
    [StringLength(256)]
    public string? NormalizedUserName { get; set; }
    
    [StringLength(256)]
    public string? Email { get; set; }
    
    [StringLength(256)]
    public string? NormalizedEmail { get; set; }
    
    public bool EmailConfirmed { get; set; }
    
    public string? PasswordHash { get; set; }
    
    public string? SecurityStamp { get; set; }
    
    public string? PhoneNumber { get; set; }
    
    public bool PhoneNumberConfirmed { get; set; }
    
    public bool TwoFactorEnabled { get; set; }
    
    public DateTimeOffset? LockoutEnd { get; set; }
    
    public bool LockoutEnabled { get; set; }
    
    public int AccessFailedCount { get; set; }
    
    public DateTime? LastSignInAt { get; set; }
    
    public bool IsDeactivated { get; set; }
    
    public DateTimeOffset InvitedAt { get; set; }
    
    public AppIdentityUserPersonalData UserPersonalData { get; set; } = null!;
    
    public List<AppIdentityUserRole> UserRoles { get; set; }
    
    public void SetUserPersonalData(AppIdentityUserPersonalData userPersonalData)
    {
        UserPersonalData = userPersonalData;
    }
}