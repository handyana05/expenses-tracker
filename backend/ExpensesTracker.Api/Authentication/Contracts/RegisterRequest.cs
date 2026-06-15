namespace ExpensesTracker.Api.Authentication.Contracts;

public sealed record RegisterRequest(
    string Email,
    string Password,
    string? DisplayName);
