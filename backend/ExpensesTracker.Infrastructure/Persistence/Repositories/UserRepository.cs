using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Domain.Entities;
using ExpensesTracker.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ExpensesTracker.Infrastructure.Persistence.Repositories;

public sealed class UserRepository(
    ExpensesTrackerDbContext dbContext) : IUserRepository
{
    private readonly ExpensesTrackerDbContext _dbContext =
        dbContext ??
        throw new ArgumentNullException(nameof(dbContext));

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _dbContext.Users
            .AddAsync(user, cancellationToken);
    }

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return _dbContext.Users
            .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
    }
}
