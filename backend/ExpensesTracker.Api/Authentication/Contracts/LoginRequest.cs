namespace ExpensesTracker.Api.Authentication.Contracts;

public sealed record LoginRequest(
    string Email,
    string Password);
