using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Infrastructure.Persistence.Context;

namespace ExpensesTracker.Infrastructure.Persistence.UnitOfWork;

public sealed class UnitOfWork(
    ExpensesTrackerDbContext dbContext) : IUnitOfWork
{
    private readonly ExpensesTrackerDbContext _dbContext =
        dbContext ??
        throw new ArgumentNullException(nameof(dbContext));

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }
}
