using AyuPos.Web.Domain.Entities.Identity;

namespace AyuPos.Web.Application.Interfaces;

public interface IJwtTokenService
{
    string GetAccessToken(
        string username,
        string userId,
        IList<string>? userRole);

    Task<string> GenerateRefreshTokenAsync(AppIdentityUser user);
    Task<bool> ValidateRefreshTokenAsync(AppIdentityUser user, string refreshToken);
}