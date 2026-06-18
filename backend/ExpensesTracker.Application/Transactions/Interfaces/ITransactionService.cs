using ExpensesTracker.Application.Transactions.DTOs;

namespace ExpensesTracker.Application.Transactions.Interfaces;

public interface ITransactionService
{
    Task<TransactionDto> CreateAsync(
        Guid userId,
        CreateTransactionDto dto,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TransactionDto>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<TransactionDto?> GetByIdAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<TransactionDto> UpdateAsync(
        Guid userId,
        UpdateTransactionDto dto,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken = default);
}
