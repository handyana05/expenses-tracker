namespace ExpensesTracker.Application.Authentication.DTOs;

public sealed record RegisterDto(
    string Email,
    string Password,
    string? DisplayName);
