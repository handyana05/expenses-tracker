namespace ExpensesTracker.Application.Transactions.DTOs;

public sealed record UpdateTransactionDto(
    Guid Id,
    Guid CategoryId,
    decimal Amount,
    DateTimeOffset TransactionDate,
    string? Description);
