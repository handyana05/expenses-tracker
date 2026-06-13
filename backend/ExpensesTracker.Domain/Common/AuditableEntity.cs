namespace ExpensesTracker.Domain.Common;

public class AuditableEntity : Entity
{
    public DateTimeOffset CreatedAtUtc { get; protected set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ModifiedAtUtc { get; protected set; }

    public void SetModified()
    {
        ModifiedAtUtc = DateTimeOffset.UtcNow;
    }
}
