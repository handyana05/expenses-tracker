using ExpensesTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpensesTracker.Infrastructure.Persistence.Context;

public sealed class ExpensesTrackerDbContext(
    DbContextOptions<ExpensesTrackerDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AssemblyMarker).Assembly);
    }
}
