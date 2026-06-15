using ExpensesTracker.Application.Authentication.DTOs;

namespace ExpensesTracker.Application.Authentication.Interfaces;

public interface IAuthService
{
    Task<AuthResultDto> RegisterAsync(
        RegisterDto dto,
        CancellationToken cancellationToken = default);
    Task<AuthResultDto?> LoginAsync(
        LoginDto dto,
        CancellationToken cancellationToken = default);
}
