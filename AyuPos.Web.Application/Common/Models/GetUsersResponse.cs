namespace AyuPos.Web.Application.Common.Models;

public class GetUsersResponse
{
    public string Id { get; set; }
    public string UserId { get; set; }
    public UserProfile? PersonalData { get; set; }
    public string[]? Roles { get; set; }
    public bool DeactivationStatus { get; set; }
}