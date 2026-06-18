using ExpensesTracker.Application.Abstractions.Authentication;
using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Authentication.DTOs;
using ExpensesTracker.Application.Authentication.Interfaces;
using ExpensesTracker.Application.Common.Exceptions;
using ExpensesTracker.Domain.Entities;

namespace ExpensesTracker.Application.Authentication.Services;

public sealed class AuthService(
    IUserRepository userRepository,
    IUnitOfWork unitOfWork,
    IPasswordHasher passwordHasher,
    IJwtTokenGenerator jwtTokenGenerator) : IAuthService
{
    private readonly IUserRepository _userRepository =
        userRepository ?? throw new ArgumentNullException(nameof(userRepository));
    private readonly IUnitOfWork _unitOfWork = 
        unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    private readonly IPasswordHasher _passwordHasher =
        passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
    private readonly IJwtTokenGenerator _jwtTokenGenerator =
        jwtTokenGenerator ?? throw new ArgumentNullException(nameof(jwtTokenGenerator));

    public async Task<AuthResultDto?> LoginAsync(
        LoginDto dto, 
        CancellationToken cancellationToken = default)
    {
        var user = await _userRepository
            .GetByEmailAsync(dto.Email, cancellationToken);

        if (user is null)
        {
            return null;
        }

        var isPasswordValid = _passwordHasher
            .VerifyPassword(user, dto.Password);

        if (!isPasswordValid)
        {
            return null;
        }

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResultDto(
            user.Id,
            user.Email,
            user.DisplayName,
            token);
    }

    public async Task<AuthResultDto> RegisterAsync(
        RegisterDto dto, 
        CancellationToken cancellationToken = default)
    {
        var existingUser = await _userRepository
            .GetByEmailAsync(dto.Email, cancellationToken);

        if (existingUser is not null) 
        {
            throw new ConflictException("User already exists.");
        }

        var user = User.Create(
            dto.Email,
            string.Empty,
            dto.DisplayName);

        var passwordHash = _passwordHasher
            .HashPassword(user, dto.Password);

        user.UpdatePasswordHash(passwordHash);

        await _userRepository.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResultDto(
            user.Id,
            user.Email,
            user.DisplayName,
            token);
    }
}
