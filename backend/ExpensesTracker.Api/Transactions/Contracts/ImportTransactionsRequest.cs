namespace ExpensesTracker.Api.Transactions.Contracts;

public sealed record ImportTransactionsRequest(
    IReadOnlyList<ImportTransactionItemRequest> Transactions);

public sealed record ImportTransactionItemRequest(
    Guid CategoryId,
    decimal Amount,
    DateTimeOffset TransactionDate,
    string? Description);
