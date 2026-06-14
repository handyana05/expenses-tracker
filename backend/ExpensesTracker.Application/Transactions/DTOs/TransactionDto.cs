using ExpensesTracker.Domain.Enums;

namespace ExpensesTracker.Application.Transactions.DTOs;

public sealed record TransactionDto(
    Guid Id,
    Guid CategoryId,
    string CategoryName,
    CategoryType CategoryType,
    decimal Amount,
    DateTimeOffset TransactionDate,
    string? Description);
