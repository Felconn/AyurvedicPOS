using AyuPos.Web.Domain.Entities.Identity;

namespace AyuPos.Web.Application.Common;

public class UserProfile
{
    public string Username { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? Nic { get; set; }
    public string? PhoneNumber { get; set; }

    public static UserProfile Create(AppIdentityUserPersonalData userPersonalData)
    {
        return new UserProfile
        {
            Username = userPersonalData.Id,
            FirstName = userPersonalData.FirstName,
            Nic = userPersonalData.Nic,
            PhoneNumber = userPersonalData.PhoneNumber
        };
    }
}