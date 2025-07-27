namespace AyuPos.Web.Application.Common;

public class LoginResponse
{
    public bool Succeeded { get; set; }
    public Guid TraceCode { get; set; }
    public DateTime DateTime { get; set; }
    public string Message { get; set; } = null!;
    public string[] Errors { get; set; } = null!;
    public bool MustChangePassword { get; set; }

    public TokenResponse Tokens { get; set; } = new();

    public static LoginResponse Success(TokenResponse tokenResponse)
    {
        return new()
        {
            Succeeded = true,
            TraceCode = Guid.NewGuid(),
            DateTime = DateTime.UtcNow,
            Message = "Operation is success",
            MustChangePassword = false,
            Tokens = tokenResponse
        };
    }

    public static LoginResponse MustChangePasswordFailure()
    {
        return new()
        {
            Succeeded = false,
            TraceCode = Guid.NewGuid(),
            DateTime = DateTime.UtcNow,
            Message = "This User Must Change Password",
            MustChangePassword = true
        };
    }

    public static LoginResponse Failure(string message)
    {
        return new()
        {
            Succeeded = false,
            TraceCode = Guid.NewGuid(),
            DateTime = DateTime.UtcNow,
            Message = message,
            MustChangePassword = false
        };
    }
}

public class TokenResponse
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}