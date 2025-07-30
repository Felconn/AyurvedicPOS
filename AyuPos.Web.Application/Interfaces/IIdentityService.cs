using AyuPos.Web.Application.Common;
using AyuPos.Web.Application.Common.Models;

namespace AyuPos.Web.Application.Interfaces;

public interface IIdentityService
{
    Task<string> GetUserNameAsync(string? userId,CancellationToken cancellationToken = default);
    Task<string> GetUserIdAsync(string userId,CancellationToken cancellationToken = default);
    Task<LoginResponse> SignInAsync(string userId, string password,CancellationToken cancellationToken = default);
    Task<Result> InviteUserAsync(string userId, string role,string password,string? firstName = null, string? lastName = null, string? nic = null, string? phone = null,CancellationToken cancellationToken = default);
    Task<Result> UpdateMyProfileAsync(UserProfile request,CancellationToken cancellationToken = default);
    Task<Result> AdminResetUserPasswordAsync(string userId, string newPassword, CancellationToken cancellationToken = default);
    Task<List<string>> GetAllRolesAsync();
    Task<List<GetUsersResponse>> GetAllUsers(CancellationToken cancellationToken = default);
    Task<Result> DisableEnableUser(string userId,bool isDeactivate,CancellationToken cancellationToken = default);
    Task<Result> ChangePasswordAsync(string currentPwd, string password,CancellationToken cancellationToken = default);
    Task<TokenResponse> GenerateTokenFromRefreshTokenAsync(string refreshToken,CancellationToken cancellationToken = default);
    Task<GetUsersResponse?> GetMyProfileAsync(CancellationToken cancellationToken = default);
    Task<List<GetUsersResponse>> GetUsersByRoleAsync(string role,CancellationToken cancellationToken = default);
    Task<Result> UpdateUsersRoleAsync(RoleChangeRequest roleChangeRequest);
}