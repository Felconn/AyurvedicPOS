namespace AyuPos.Web.Application.Common;

public class Result
{
    internal Result(bool succeeded, string message, string[] errors)
    {
        Succeeded = succeeded;
        Errors = errors;
        Message = message;
        TraceCode = Guid.NewGuid();
        DateTime = DateTime.UtcNow;
    }
    
    internal Result(string message)
    {
        Succeeded = false;
        IsPending = true;
        Errors = Array.Empty<string>();
        Message = message;
        TraceCode = Guid.NewGuid();
        DateTime = DateTime.UtcNow;
    }

    public bool Succeeded { get; set; }
    public bool IsPending { get; set; }
    public Guid TraceCode { get; set; }
    public DateTime DateTime { get; set; }
    public string Message { get; set; }
    public string[] Errors { get; set; }

    public static Result Success()
    {
        return new Result(true, "Operation is success", Array.Empty<string>());
    }

    public static Result Success(string message)
    {
        return new Result(true, message, Array.Empty<string>());
    }

    public static Result Pending(string message = "Operation is going on")
    {
        return new Result("Operation is going on");
    }

    public static Result Failure(params string[] errors)
    {
        return new Result(false, "Operation is failed", errors);
    }

    public static Result Failure(string message, params string[] errors)
    {
        return new Result(false, message, errors);
    }
}