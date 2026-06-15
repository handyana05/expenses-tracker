namespace ExpensesTracker.Application.Authentication.DTOs;

public sealed record LoginDto(
    string Email,
    string Password);
