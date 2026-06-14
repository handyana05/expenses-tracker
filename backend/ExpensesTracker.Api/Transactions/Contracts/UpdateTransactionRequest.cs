namespace ExpensesTracker.Api.Transactions.Contracts;

public sealed record UpdateTransactionRequest(
    Guid CategoryId,
    decimal Amount,
    DateTimeOffset TransactionDate,
    string? Description);
