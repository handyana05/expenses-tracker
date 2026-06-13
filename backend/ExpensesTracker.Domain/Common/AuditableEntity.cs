namespace ExpensesTracker.Domain.Common;

public class AuditableEntity : Entity
{
    public DateTimeOffset CreatedAtUtc { get; protected set; }
    public DateTimeOffset? ModifiedAtUtc { get; protected set; }

}
