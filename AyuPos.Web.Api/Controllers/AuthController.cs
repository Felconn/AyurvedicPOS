using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AyuPos.Web.Application.Common;
using AyuPos.Web.Application.Interfaces;

namespace AyuPos.Web.Api.Controllers;

[AllowAnonymous]
public class AuthController : BaseController
{
    private readonly IIdentityService _identityService;

    public AuthController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await _identityService.SignInAsync(request.Username, request.Password, cancellationToken);
        
        if (!result.Succeeded)
        {
            return Unauthorized(result);
        }

        if (result.MustChangePassword)
        {
            return StatusCode(403, result);
        }

        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var tokenResponse = await _identityService.GenerateTokenFromRefreshTokenAsync(request.RefreshToken, cancellationToken);
            return Ok(LoginResponse.Success(tokenResponse));
        }
        catch (Exception ex)
        {
            return Unauthorized(LoginResponse.Failure(ex.Message));
        }
    }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RefreshTokenRequest
{
    public string UserId { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}