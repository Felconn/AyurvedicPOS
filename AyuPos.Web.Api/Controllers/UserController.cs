using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AyuPos.Web.Application.Common;
using AyuPos.Web.Application.Common.Constants;
using AyuPos.Web.Application.Common.Models;
using AyuPos.Web.Application.Interfaces;

namespace AyuPos.Web.Api.Controllers;

[Authorize(Roles = $"{RoleConstant.SuperAdmin},{RoleConstant.Admin}")]
public class UserController : BaseController
{
    private readonly IIdentityService _identityService;

    public UserController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers(CancellationToken cancellationToken)
    {
        var users = await _identityService.GetAllUsers(cancellationToken);
        return Ok(users);
    }

    [HttpGet("roles")]
    public async Task<IActionResult> GetAllRoles()
    {
        var roles = await _identityService.GetAllRolesAsync();
        return Ok(roles);
    }

    [HttpGet("by-role/{role}")]
    public async Task<IActionResult> GetUsersByRole(string role, CancellationToken cancellationToken)
    {
        var users = await _identityService.GetUsersByRoleAsync(role, cancellationToken);
        return Ok(users);
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetMyProfile(CancellationToken cancellationToken)
    {
        var profile = await _identityService.GetMyProfileAsync(cancellationToken);
        if (profile == null)
        {
            return NotFound("User profile not found");
        }
        return Ok(profile);
    }

    [HttpPost("invite")]
    public async Task<IActionResult> InviteUser([FromBody] InviteUserRequest request, CancellationToken cancellationToken)
    {
        var result = await _identityService.InviteUserAsync(
            request.UserId,
            request.Role,
            request.Password,
            request.FirstName,
            request.LastName,
            request.Nic,
            request.Phone,
            cancellationToken);

        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPut("{userId}/profile")]
    public async Task<IActionResult> UpdateMyProfile(string userId,[FromBody] UserProfile request, CancellationToken cancellationToken)
    {
        var result = await _identityService.UpdateProfileByAdminAsync(userId,request, cancellationToken);
        
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPut("{userId}/status")]
    public async Task<IActionResult> UpdateUserStatus(string userId, [FromBody] UpdateUserStatusRequest request, CancellationToken cancellationToken)
    {
        var result = await _identityService.DisableEnableUser(userId, request.IsDeactivate, cancellationToken);
        
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPut("{userId}/role")]
    public async Task<IActionResult> UpdateUserRole(string userId,[FromBody] RoleChangeRequest request)
    {
        var result = await _identityService.UpdateUsersRoleAsync(userId,request);
        
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        var result = await _identityService.ChangePasswordAsync(request.CurrentPassword, request.NewPassword, cancellationToken);
        
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var result = await _identityService.AdminResetUserPasswordAsync(request.UserId, request.NewPassword, cancellationToken);
        
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("{userId}/name")]
    public async Task<IActionResult> GetUserName(string userId, CancellationToken cancellationToken)
    {
        var userName = await _identityService.GetUserNameAsync(userId, cancellationToken);
        return Ok(new { UserName = userName });
    }

    [HttpGet("username/{username}/id")]
    public async Task<IActionResult> GetUserId(string username, CancellationToken cancellationToken)
    {
        try
        {
            var userId = await _identityService.GetUserIdAsync(username, cancellationToken);
            return Ok(new { UserId = userId });
        }
        catch (Exception ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }
}

public class InviteUserRequest
{
    public string UserId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Nic { get; set; }
    public string? Phone { get; set; }
}

public class UpdateUserStatusRequest
{
    public bool IsDeactivate { get; set; }
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    public string UserId { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}