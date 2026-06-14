using ExpensesTracker.Domain.Common;

namespace ExpensesTracker.Domain.Entities;

public class Transaction : AuditableEntity
{
    public decimal Amount { get; private set; }
    public DateTimeOffset TransactionDate { get; private set; }
    public string? Description { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;

    public Guid CategoryId { get; private set; }
    public Category Category { get; private set; } = null!;

    private Transaction()
    { }

    private Transaction(
        Guid userId,
        Guid categoryId,
        decimal amount,
        DateTimeOffset transactionDate,
        string? description = null)
    {
        SetAmount(amount);
        UserId = userId;
        CategoryId = categoryId;
        TransactionDate = transactionDate;
        Description = description;
    }

    public static Transaction Create(
        Guid userId,
        Guid categoryId,
        decimal amount,
        DateTimeOffset transactionDate,
        string? description = null)
        => new(userId, categoryId, amount, transactionDate, description);

    public void Update(
        Guid categoryId,
        decimal amount,
        DateTimeOffset transactionDate,
        string? description = null)
    {
        SetAmount(amount);
        CategoryId = categoryId;
        TransactionDate = transactionDate;
        Description = description;
        SetModified();
    }

    private void SetAmount(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(amount),
                "Transaction amount must be greater than zero.");
        }

        Amount = amount;
    }
}
