using System.ComponentModel.DataAnnotations;

namespace AyuPos.Standalone.Ui.Common.Entities.Identity;

public class AppIdentityRole : BaseEntity
{
    public AppIdentityRole()
    {
        UserRoles = new List<AppIdentityUserRole>();
    }
    
    public AppIdentityRole(string roleName) : this()
    {
        Name = roleName;
        NormalizedName = roleName.ToUpper();
    }
    
    [Required]
    [StringLength(256)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(256)]
    public string? NormalizedName { get; set; }
    
    public List<AppIdentityUserRole> UserRoles { get; set; }
}