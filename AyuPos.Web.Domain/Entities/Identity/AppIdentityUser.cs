using Microsoft.AspNetCore.Identity;

namespace AyuPos.Web.Domain.Entities.Identity;

public class AppIdentityUser : IdentityUser
{
    // Parameterless constructor required by Entity Framework
    protected AppIdentityUser()
    {
        UserRoles = new List<AppIdentityUserRole>();
        InvitedAt = DateTimeOffset.UtcNow;
        
        if (UserPersonalData == null)
            UserPersonalData = new AppIdentityUserPersonalData(Id);
    }

    public AppIdentityUser(string userId) : this()
    {
        UserName = userId;

        if (UserPersonalData == null)
            UserPersonalData = new AppIdentityUserPersonalData(Id);
    }
    
    public AppIdentityUser(string userId,string? firstName, string? lastName, string? phoneNumber, string? nic) : this(userId)
    {
        UserPersonalData = new AppIdentityUserPersonalData(Id, firstName, lastName, phoneNumber, nic);
    }
    
    public DateTime? LastSignInAt { get; set; }
    public bool IsDeactivated { get; set; }
    public DateTimeOffset InvitedAt { get; set; }
    
    
    public AppIdentityUserPersonalData UserPersonalData { get; private set; }
    public List<AppIdentityUserRole> UserRoles { get; private set; }
    
    public void SetUserPersonalData(AppIdentityUserPersonalData userPersonalData)
    {
        UserPersonalData = userPersonalData;
    }
}