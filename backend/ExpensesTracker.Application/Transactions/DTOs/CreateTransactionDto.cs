namespace ExpensesTracker.Application.Transactions.DTOs;

public sealed record CreateTransactionDto(
    Guid CategoryId,
    decimal Amount,
    DateTimeOffset TransactionDate,
    string? Description);
