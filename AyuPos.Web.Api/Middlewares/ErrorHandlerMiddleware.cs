using System.Net;
using System.Text.Json;
using AyuPos.Web.Application.Common.Exceptions;
using AyuPos.Web.Application.Common.Models;

namespace AyuPos.Web.Api.Middlewares;

public class ErrorHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlerMiddleware> _logger;

    public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        var response = context.Response;

        var result = string.Empty;
        try
        {
            await _next(context);
        }
        catch (ArgumentException error)
        {
            response.StatusCode = (int)HttpStatusCode.BadRequest;
            result = JsonSerializer.Serialize(Result.Failure(error.Message), new JsonSerializerOptions()
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            _logger.LogError("ArgumentException : {@Message}", error.Message);
            _logger.LogError("StackTrace : {@StackTrace}", error.StackTrace);
            response.ContentType = "application/json";
            await response.WriteAsync(result);
        }
        catch (ValidationException error)
        {
            response.StatusCode = (int)HttpStatusCode.BadRequest;
            
            var errors = error.Errors
                .Select(e => e.Key + " : " + string.Join(",", e.Value))
                .ToArray();
            
            result = JsonSerializer.Serialize(Result.Failure(error.Message, errors), new JsonSerializerOptions()
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            _logger.LogError("ValidationException : {@Message}", error.Message);
            _logger.LogError("Result : {@Result}", result);
            response.ContentType = "application/json";
            await response.WriteAsync(result);
        }
        catch (Exception error)
        {
            
            Console.WriteLine(error);
            
            response.StatusCode = (int)HttpStatusCode.InternalServerError;

            result = JsonSerializer.Serialize(Result.Failure(error.Message), new JsonSerializerOptions()
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            
            _logger.LogError("Exception : {@Message}", error.Message);
            _logger.LogError("StackTrace : {@StackTrace}", error.StackTrace);
            response.ContentType = "application/json";
            await response.WriteAsync(result);
        }
    }
}