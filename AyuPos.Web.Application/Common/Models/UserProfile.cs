using AyuPos.Web.Domain.Entities.Identity;

namespace AyuPos.Web.Application.Common;

public class UserProfile
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Nic { get; set; }
    public string? PhoneNumber { get; set; }

    public static UserProfile Create(AppIdentityUserPersonalData userPersonalData)
    {
        return new UserProfile
        {
            FirstName = userPersonalData.FirstName,
            LastName = userPersonalData.LastName,
            Nic = userPersonalData.Nic,
            PhoneNumber = userPersonalData.PhoneNumber
        };
    }
}