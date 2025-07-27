using Microsoft.AspNetCore.Identity;

namespace AyuPos.Web.Domain.Entities.Identity;

public class AppIdentityRole : IdentityRole
{
    public AppIdentityRole()
    {
        UserRoles = new List<AppIdentityUserRole>();
    }
    
    public AppIdentityRole(string roleName) : this()
    {
        Name = roleName;
    }
    
    public List<AppIdentityUserRole> UserRoles { get; set; }
}