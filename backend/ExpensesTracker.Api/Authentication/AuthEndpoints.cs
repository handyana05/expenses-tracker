using ExpensesTracker.Api.Authentication.Contracts;
using ExpensesTracker.Api.Common.Validation;
using ExpensesTracker.Application.Authentication.DTOs;
using ExpensesTracker.Application.Authentication.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesTracker.Api.Authentication;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup(AuthRoutes.Base)
            .WithTags("Authentication");

        group.MapPost("/register", RegisterAsync)
            .WithName("Register")
            .WithSummary("Register a new user")
            .WithDescription("Creates a new user account and returns a JWT access token.")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .AddEndpointFilter<ValidationFilter<RegisterRequest>>();

        group.MapPost("/login", LoginAsync)
            .WithName("Login")
            .WithSummary("Login")
            .WithDescription("Authenticate a user and returs a JWT access token.")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .AddEndpointFilter<ValidationFilter<LoginRequest>>();

        return app;
    }

    private static async Task<IResult> RegisterAsync(
        [FromServices] IAuthService authService,
        [FromBody] RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var result = await authService
            .RegisterAsync(
                new RegisterDto(
                    request.Email,
                    request.Password,
                    request.DisplayName),
                cancellationToken);
        return Results.Ok(result);
    }

    private static async Task<IResult> LoginAsync(
        [FromServices] IAuthService authService,
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await authService
            .LoginAsync(
                new LoginDto(
                    request.Email,
                    request.Password),
                cancellationToken);
        return result is null
            ? Results.Unauthorized()
            : Results.Ok(result);
    }
}
