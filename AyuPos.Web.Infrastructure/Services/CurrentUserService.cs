using System.Security.Claims;
using AyuPos.Web.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace AyuPos.Web.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor? _httpContextAccessor;
    private string _userId = string.Empty;
    private List<string> _userRoles = new();

    public CurrentUserService(IHttpContextAccessor? httpContextAccessor = null)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string UserId => 
        _httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? _userId;

    public List<string> UserRoles()
    {
        if (_httpContextAccessor?.HttpContext?.User != null)
        {
            return _httpContextAccessor.HttpContext.User.Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(x => x.Value)
                .ToList();
        }
        return _userRoles;
    }

    public void SetUserId(string userId)
    {
        _userId = userId;
    }

    public void SetUserRoles(List<string> roles)
    {
        _userRoles = roles;
    }
}