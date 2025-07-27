using Microsoft.AspNetCore.Identity;

namespace AyuPos.Web.Domain.Entities.Identity;

public class AppIdentityUser : IdentityUser
{

    public AppIdentityUser(string userName)
    {
        UserName = userName;
        UserRoles = new List<AppIdentityUserRole>();

        if (UserPersonalData == null)
            UserPersonalData = new AppIdentityUserPersonalData(Id);
        
        InvitedAt = DateTimeOffset.UtcNow;
    }
    
    public AppIdentityUser(string userName,string? firstName, string? lastName, string? phoneNumber, string? nic) : this(userName)
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