namespace ExpensesTracker.Domain.Common;

public class Entity
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
}
