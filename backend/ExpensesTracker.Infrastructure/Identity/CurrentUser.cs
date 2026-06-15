using ExpensesTracker.Application.Abstractions.Identity;

namespace ExpensesTracker.Infrastructure.Identity;

public sealed class CurrentUser : ICurrentUser
{
    public Guid UserId => Guid.Parse("00000000-0000-0000-0000-000000000001");
}
