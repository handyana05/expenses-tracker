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

    private Category()
    { }

    private Category(Guid userId, string name, CategoryType type)
    {
        UserId = userId;
        Name = name;
        Type = type;
    }

    public static Category Create(Guid userId, string name, CategoryType type)
        => new(userId, name, type);

    public void Update(string name, CategoryType type)
    {
        Name = name;
        Type = type;

        SetModified();
    }
}
