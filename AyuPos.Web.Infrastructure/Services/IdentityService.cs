using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AyuPos.Web.Application.Common;
using AyuPos.Web.Application.Common.Constants;
using AyuPos.Web.Application.Common.Extensions;
using AyuPos.Web.Application.Common.Models;
using AyuPos.Web.Application.Interfaces;
using AyuPos.Web.Domain.Entities.Identity;
using Throw;

namespace AyuPos.Web.Infrastructure.Services;

public class IdentityService : IIdentityService
{
    private readonly ICurrentUserService _currentUserService;
    private readonly RoleManager<AppIdentityRole> _roleManager;
    private readonly SignInManager<AppIdentityUser> _signInManager;
    private readonly IJwtTokenService _tokenService;
    private readonly IAppDbContext _appDbContext;
    private readonly UserManager<AppIdentityUser> _userManager;


    public IdentityService(
        UserManager<AppIdentityUser> userManager,
        SignInManager<AppIdentityUser> signInManager,
        RoleManager<AppIdentityRole> roleManager,
        ICurrentUserService currentUserService,
        IJwtTokenService tokenService,
        IAppDbContext appDbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _currentUserService = currentUserService;
        _tokenService = tokenService;
        _appDbContext = appDbContext;
    }


    public async Task<string> GetUserNameAsync(string? userId, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.Users.Where(x => x.Id == userId)
            .Select(x => x.UserPersonalData!.FirstName + " " + x.UserPersonalData.LastName)
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);
        return user ?? "No user exist for the given user id";
    }

    public async Task<string> GetUserIdAsync(string userId, CancellationToken cancellationToken = default)
    {
        var id = await _userManager.Users.Where(x => x.UserName == userId)
            .Select(x => x.Id)
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);

        id.ThrowIfNull("No user exist for the given user email");

        return id;
    }


    public async Task<Result> InviteUserAsync(string userId, string role, string password, string? firstName = null,
        string? lastName = null, string? nic = null, string? phone = null,
        CancellationToken cancellationToken = default)
    {
        var isUserNameAlreadyTaken =
            await _userManager.Users.AnyAsync(x => x.UserName == userId, cancellationToken: cancellationToken);

        if (isUserNameAlreadyTaken)
            return Result.Failure("UserId already taken");

        if (!await _roleManager.RoleExistsAsync(role))
            return Result.Failure("Invalid role");


        var user = new AppIdentityUser(userId, firstName, lastName, phone, nic)
        {
            InvitedAt = DateTime.UtcNow,
        };

        var userCreationData = await _userManager.CreateAsync(user, password);
        await _userManager.AddToRoleAsync(user, role);
        return userCreationData.ToApplicationResult();
    }

    public async Task<LoginResponse> SignInAsync(string uesrId, string password,
        CancellationToken cancellationToken = default)
    {
        var user = await GetUserAsync(uesrId, cancellationToken);
        user.Throw("This account has been deactivated, Please contact the administrator", null)
            .IfTrue(user.IsDeactivated);

        var signInResult = await _signInManager.PasswordSignInAsync(user, password, false, false);

        if (signInResult.IsLockedOut)
            return LoginResponse.Failure("This account has been locked, Please contact the administrator");

        if (!signInResult.Succeeded)
            return LoginResponse.Failure("Invalid email or password");

        user.LastSignInAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);
        return LoginResponse.Success(await GetTokenAsync(user));
    }
    
    public async Task<Result> AdminResetUserPasswordAsync(string userId, string newPassword, CancellationToken cancellationToken = default)
    {
        var isAdmin = _currentUserService.UserRoles().Any(x => x is RoleConstant.Admin or RoleConstant.SuperAdmin);
        if (!isAdmin)
            return Result.Failure("Only administrators can reset user passwords");


        var user = await GetUserAsync(userId, cancellationToken);
        if (user == null)
            return Result.Failure("User not found");
        
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

        return result.ToApplicationResult();
    }

    public Task<List<string>> GetAllRolesAsync()
    {
        var userId = _currentUserService.UserId;
        
        return _roleManager.Roles
            .AsNoTracking()
            .Select(x => x.Name!)
            .ToListAsync();
    }

    public async Task<List<GetUsersResponse>> GetAllUsers(CancellationToken cancellationToken = default)
    {
        return await _userManager.Users
            .AsSingleQuery()
            .Include(x => x.UserRoles)!
            .ThenInclude(x => x.Role)
            .Select(x => new GetUsersResponse
            {
                Id = x.Id,
                UserId = x.UserName!,
                PersonalData = UserProfile.Create(x.UserPersonalData),
                Roles = x.UserRoles.Where(y => y.Role.Name != null).Select(y => y.Role.Name!).ToArray(),
                DeactivationStatus = x.IsDeactivated,
            })
            .ToListAsync(cancellationToken: cancellationToken);
    }

    public async Task<Result> DisableEnableUser(string userId, bool isDeactivate,
        CancellationToken cancellationToken = default)
    {
        if (_currentUserService.UserRoles().Any(x => x != RoleConstant.Admin && x != RoleConstant.SuperAdmin))
            return Result.Failure("User haven't access for the function!");

        var user = await _userManager.Users
            .Include(x => x.UserRoles!)
            .ThenInclude(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken: cancellationToken);

        if (user is null)
            return Result.Failure("No user exist for the given user id");

        if (user.UserRoles!.Any(x => x.Role.Name == RoleConstant.SuperAdmin))
            return Result.Failure("Can't disable or enable super admins");

        if (user.IsDeactivated == isDeactivate)
            return Result.Failure(isDeactivate ? $"User already deactivated" : $"User already activated");

        user.IsDeactivated = isDeactivate;
        await _userManager.UpdateAsync(user);
        return Result.Success();
    }

    public async Task<Result> UpdateMyProfileAsync(UserProfile request, CancellationToken cancellationToken = default)
    {
        var user = await GetUserAsync(_currentUserService.UserId, cancellationToken);
        user.ThrowIfNull("No user exists", null);
        var personalData = user.UserPersonalData ?? new AppIdentityUserPersonalData(user.Id);
        request.MatchTo(personalData);

        await _userManager.UpdateAsync(user);
        await _appDbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }

    public async Task<GetUsersResponse?> GetMyProfileAsync(CancellationToken cancellationToken = default)
    {
        return await _userManager.Users
            .AsSingleQuery()
            .Where(x => x.Id == _currentUserService.UserId)
            .Include(x => x.UserRoles)!
            .ThenInclude(x => x.Role)
            .Select(x => new GetUsersResponse
            {
                Id = x.Id,
                UserId = x.UserName!,
                PersonalData = UserProfile.Create(x.UserPersonalData),
                Roles = x.UserRoles.Where(y => y.Role.Name != null).Select(y => y.Role.Name!).ToArray(),
                DeactivationStatus = x.IsDeactivated,
            })
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);
    }

    public async Task<List<GetUsersResponse>> GetUsersByRoleAsync(string role,
        CancellationToken cancellationToken = default)
    {
        return await _userManager.Users
            .Include(x => x.UserRoles)
            .Where(x => x.UserRoles.Any(y => y.Role.Name == role) && !x.IsDeactivated)
            .Select(x => new GetUsersResponse
            {
                Id = x.Id,
                UserId = x.UserName!,
                PersonalData = UserProfile.Create(x.UserPersonalData),
                Roles = x.UserRoles.Where(y => y.Role.Name != null).Select(y => y.Role.Name!).ToArray(),
                DeactivationStatus = x.IsDeactivated,
            })
            .ToListAsync(cancellationToken: cancellationToken);
    }

    public async Task<Result> ChangePasswordAsync(string currentPwd, string password,
        CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(_currentUserService.UserId);

        user.ThrowIfNull("No user exists", null);

        currentPwd.Throw("Current password and new password can't be same").IfEquals(password);

        var currentPwdCheckResult = await _userManager.CheckPasswordAsync(user, currentPwd);
        if (!currentPwdCheckResult) return Result.Failure("Current password is invalid!");

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var res = await _userManager.ResetPasswordAsync(user, token, password);

        return res.ToApplicationResult();
    }

    public async Task<TokenResponse> GenerateTokenFromRefreshTokenAsync(string refreshToken,
        CancellationToken cancellationToken = default)
    {
        var user = await GetUserAsync(_currentUserService.UserId, cancellationToken);
        var isRefreshTokenResult = await _tokenService.ValidateRefreshTokenAsync(user, refreshToken);

        isRefreshTokenResult.Throw("Invalid refresh token", null).IfFalse();

        var token = await GetTokenAsync(user);
        return new TokenResponse
        {
            AccessToken = token.AccessToken,
            RefreshToken = token.RefreshToken
        };
    }


    // Private Methods
    private async Task<AppIdentityUser> GetUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == userId,
            cancellationToken: cancellationToken);
        user.ThrowIfNull("Invalid UserId", null);
        // await CheckAndSetUserPersonalDataAsync(user);
        return user;
    }

    private async Task<TokenResponse> GetTokenAsync(AppIdentityUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);

        return new TokenResponse
        {
            AccessToken = _tokenService.GetAccessToken(user.UserName!, user.Id, roles),
            RefreshToken = await _tokenService.GenerateRefreshTokenAsync(user)
        };
    }

    // private async Task CheckAndSetUserPersonalDataAsync(AppIdentityUser appIdentityUser)
    // {
    //     appIdentityUser.SetUserPersonalData(appIdentityUser.UserPersonalData);
    //     await _appDbContext.AppIdentityUserPersonalData.AddAsync(appIdentityUser.UserPersonalData);
    //     await _userManager.UpdateAsync(appIdentityUser);
    //     
    // }

    public async Task<Result> UpdateUsersRoleAsync(RoleChangeRequest roleChangeRequest)
    {
        var selector = await _userManager.Users
            .AsSingleQuery()
            .Where(x => x.Id == roleChangeRequest.UserId)
            .Include(x => x.UserRoles)!
            .ThenInclude(x => x.Role)
            .Select(x => new
            {
                User = x,
                Role = x.UserRoles.Select(y => y.Role.Name).First()
            }).FirstOrDefaultAsync();

        var role = await _roleManager.FindByNameAsync(roleChangeRequest.RoleName);

        selector.ThrowIfNull("No user exist for the given user id", null);
        role.ThrowIfNull("No role exists for given role name", null);

        await _userManager.RemoveFromRoleAsync(selector.User, selector.Role);
        await _userManager.AddToRoleAsync(selector.User, role.Name);
        return Result.Success();
    }
}