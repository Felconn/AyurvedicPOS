namespace AyuPos.Web.Application.Common.Models;

public class RoleChangeRequest
{
    public string UserId { get; set; } = null!;
    public string RoleName { get; set; } = null!;
}