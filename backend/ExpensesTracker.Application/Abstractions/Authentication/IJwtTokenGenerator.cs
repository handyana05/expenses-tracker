using ExpensesTracker.Domain.Entities;

namespace ExpensesTracker.Application.Abstractions.Authentication;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
