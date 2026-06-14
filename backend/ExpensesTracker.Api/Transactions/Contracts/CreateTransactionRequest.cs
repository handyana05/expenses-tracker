namespace ExpensesTracker.Api.Transactions.Contracts;

public sealed record CreateTransactionRequest(
    Guid CategoryId,
    decimal Amount,
    DateTimeOffset TransactionDate,
    string? Description);
