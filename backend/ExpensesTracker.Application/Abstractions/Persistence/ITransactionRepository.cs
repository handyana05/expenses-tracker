using ExpensesTracker.Domain.Entities;

namespace ExpensesTracker.Application.Abstractions.Persistence;

public interface ITransactionRepository
{
    Task<IReadOnlyList<Transaction>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Transaction?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(Transaction transaction, CancellationToken cancellationToken = default);
    void Update(Transaction transaction);
    void Delete(Transaction transaction);
}
