using ExpensesTracker.Application.Common.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesTracker.Api.Common.ExceptionHandling;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, 
        Exception exception, 
        CancellationToken cancellationToken)
    {
        var problemDetails = exception switch
        {
            NotFoundException => CreateProblemDetails(
                httpContext,
                StatusCodes.Status404NotFound,
                "Not Found",
                exception.Message),
            ConflictException => CreateProblemDetails(
                httpContext,
                StatusCodes.Status409Conflict,
                "Conflict",
                exception.Message),
            UnauthorizedException => CreateProblemDetails(
                httpContext,
                StatusCodes.Status401Unauthorized,
                "Unauthorized",
                exception.Message),
            _ => CreateProblemDetails(
                httpContext,
                StatusCodes.Status500InternalServerError,
                "Server Error",
                "An unexpected error occured.")
        };

        httpContext.Response.StatusCode = problemDetails.Status!.Value;
        await httpContext.Response.WriteAsJsonAsync(
            problemDetails,
            cancellationToken);
        return true;
    }

    private static ProblemDetails CreateProblemDetails(
        HttpContext httpContext, 
        int statusCode, 
        string title, 
        string detail)
        => new()
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = httpContext.Request.Path
        };
}
