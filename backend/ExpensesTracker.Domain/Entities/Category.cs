using ExpensesTracker.Domain.Common;
using ExpensesTracker.Domain.Enums;

namespace ExpensesTracker.Domain.Entities;

public class Category : AuditableEntity
{
    public string Name { get; private set; } = null!;
    public CategoryType Type { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;

    private readonly List<Transaction> _transactions = [];
    public IReadOnlyCollection<Transaction> Transactions => _transactions.AsReadOnly();
}
