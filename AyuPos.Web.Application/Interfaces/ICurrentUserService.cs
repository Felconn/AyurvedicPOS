namespace AyuPos.Web.Application.Interfaces;

public interface ICurrentUserService
{
    string UserId { get; }
    string UserName { get; }
    List<string> UserRoles();
    void SetUserId(string userId);
    void SetUserRoles(List<string> roles);
}