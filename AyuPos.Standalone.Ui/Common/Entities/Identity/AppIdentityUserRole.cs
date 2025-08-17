using System.ComponentModel.DataAnnotations;

namespace AyuPos.Standalone.Ui.Common.Entities.Identity;

public class AppIdentityUserRole
{
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string RoleId { get; set; } = string.Empty;
    
    public virtual AppIdentityUser User { get; set; } = null!;
    public virtual AppIdentityRole Role { get; set; } = null!;
}