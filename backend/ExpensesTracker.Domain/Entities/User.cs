using ExpensesTracker.Domain.Common;

namespace ExpensesTracker.Domain.Entities;

public class User : AuditableEntity
{
    public string Email { get; private set; } = null!;
    public string PasswordHash { get; private set; } = null!;
    public string? DisplayName { get; private set; }

    private readonly List<Category> _categories = [];
    public IReadOnlyCollection<Category> Categories => _categories.AsReadOnly();

    private readonly List<Transaction> _transactions = [];
    public IReadOnlyCollection<Transaction> Transactions => _transactions.AsReadOnly();

    private User()
    { }

    private User(string email, string passwordHash, string? displayName = "")
    {
        Email = email;
        PasswordHash = passwordHash;
        DisplayName = displayName;
    }

    public static User Create(string email, string passwordHash, string? displayName = "")
        => new(email, passwordHash, displayName);
}
