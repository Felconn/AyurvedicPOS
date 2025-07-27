using System.ComponentModel.DataAnnotations;

namespace AyuPos.Web.Domain.Entities.Identity;

public class AppIdentityUserPersonalData : BaseEntity
{
    public AppIdentityUserPersonalData(string id)
    {
        Id = id;
    }
    
    public AppIdentityUserPersonalData(string id, string? firstName, string? lastName, string? phoneNumber, string? nic) : this(id)
    {
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        Nic = nic;
    }
    
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Nic { get; set; }
}