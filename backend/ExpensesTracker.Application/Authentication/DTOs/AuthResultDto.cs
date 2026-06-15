namespace ExpensesTracker.Application.Authentication.DTOs;

public sealed record AuthResultDto(
    Guid UserId,
    string Email,
    string? DisplayName,
    string AccessToken);
