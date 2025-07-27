using Microsoft.AspNetCore.Identity;

namespace AyuPos.Web.Domain.Entities.Identity;

public class AppIdentityUserRole : IdentityUserRole<string>
{
    public virtual AppIdentityUser User { get; set; } = null!;
    public virtual AppIdentityRole Role { get; set; } = null!;
}