using ExpensesTracker.Application.Transactions.DTOs;
using ExpensesTracker.Domain.Entities;

namespace ExpensesTracker.Application.Transactions.Mappers;

public static class TransactionMapper
{
    public static TransactionDto ToDto(
        this Transaction transaction,
        Category? category = null)
    {
        var transactionCategory = category ?? transaction.Category;

        return new TransactionDto(
            transaction.Id,
            transaction.CategoryId,
            transactionCategory.Name,
            transactionCategory.Type,
            transaction.Amount,
            transaction.TransactionDate,
            transaction.Description);
    }

    public static IEnumerable<TransactionDto> ToDtos(
        this IEnumerable<Transaction> transactions)
        => transactions.Select(t => t.ToDto());
}
