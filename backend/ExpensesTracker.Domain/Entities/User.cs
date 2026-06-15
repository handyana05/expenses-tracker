using ExpensesTracker.Domain.Common;

namespace ExpensesTracker.Domain.Entities;

public class User : AuditableEntity
{
    public string Email { get; private set; } = null!;
    public string PasswordHash { get; private set; } = null!;
    public string? DisplayName { get; private set; }

    public ICollection<Category> Categories { get; private set; } = [];

    public ICollection<Transaction> Transactions { get; private set; } = [];

    private User()
    { }

    private User(string email, string passwordHash, string? displayName = null)
    {
        Email = email;
        PasswordHash = passwordHash;
        DisplayName = displayName;
    }

    public static User Create(string email, string passwordHash, string? displayName = null)
        => new(email, passwordHash, displayName);

    public void UpdatePasswordHash(string passwordHash)
    {
        PasswordHash = passwordHash;
        SetModified();
    }
}
