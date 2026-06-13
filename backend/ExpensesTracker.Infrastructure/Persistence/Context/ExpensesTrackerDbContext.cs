using ExpensesTracker.Domain.Common;
using ExpensesTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpensesTracker.Infrastructure.Persistence.Context;

public sealed class ExpensesTrackerDbContext(
    DbContextOptions<ExpensesTrackerDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    public override async Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries<AuditableEntity>();
        var utcNow = DateTimeOffset.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Property(nameof(AuditableEntity.CreatedAtUtc))
                    .CurrentValue = utcNow;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Property(nameof(AuditableEntity.ModifiedAtUtc))
                    .CurrentValue = utcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AssemblyMarker).Assembly);
    }
}
