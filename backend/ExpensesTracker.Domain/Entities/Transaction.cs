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
}
