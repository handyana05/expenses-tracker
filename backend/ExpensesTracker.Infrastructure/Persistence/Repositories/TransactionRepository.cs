using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Domain.Entities;
using ExpensesTracker.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ExpensesTracker.Infrastructure.Persistence.Repositories;

public sealed class TransactionRepository(
    ExpensesTrackerDbContext dbContext) : ITransactionRepository
{
    private readonly ExpensesTrackerDbContext _dbContext =
        dbContext ??
        throw new ArgumentNullException(nameof(dbContext));

    public async Task AddAsync(Transaction transaction, CancellationToken cancellationToken = default)
    {
        await _dbContext.Transactions
            .AddAsync(transaction, cancellationToken);
    }

    public void Delete(Transaction transaction)
    {
        _dbContext.Transactions
            .Remove(transaction);
    }

    public async Task<Transaction?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Transactions
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, cancellationToken);
    }

    public async Task<IReadOnlyList<Transaction>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Transactions
            .Include(x => x.Category)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.TransactionDate)
            .ToListAsync(cancellationToken);
    }

    public void Update(Transaction transaction)
    {
        _dbContext.Transactions
            .Update(transaction);
    }
}
