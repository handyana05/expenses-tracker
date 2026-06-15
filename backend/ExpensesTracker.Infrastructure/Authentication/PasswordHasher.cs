using ExpensesTracker.Application.Abstractions.Authentication;
using ExpensesTracker.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace ExpensesTracker.Infrastructure.Authentication;

public sealed class PasswordHasher : IPasswordHasher
{
    private readonly PasswordHasher<User> _passwordHasher = new();

    public string HashPassword(
        User user, 
        string password)
    {
        return _passwordHasher
            .HashPassword(user, password);
    }

    public bool VerifyPassword(User user, string password)
    {
        var result = _passwordHasher
            .VerifyHashedPassword(user, user.PasswordHash, password);
        return result != PasswordVerificationResult.Failed;
    }
}
