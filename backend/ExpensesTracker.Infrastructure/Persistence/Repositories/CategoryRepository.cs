using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Domain.Entities;
using ExpensesTracker.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ExpensesTracker.Infrastructure.Persistence.Repositories;

public sealed class CategoryRepository(
    ExpensesTrackerDbContext dbContext) : ICategoryRepository
{
    private readonly ExpensesTrackerDbContext _dbContext =
        dbContext ??
        throw new ArgumentNullException(nameof(dbContext));

    public async Task AddAsync(Category category, CancellationToken cancellationToken = default)
    {
        await _dbContext.Categories
            .AddAsync(category, cancellationToken);
    }

    public void Delete(Category category)
    {
        _dbContext.Categories
            .Remove(category);
    }

    public async Task<Category?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Categories
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, 
            cancellationToken);
    }

    public async Task<IReadOnlyList<Category>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Categories
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public void Update(Category category)
    {
        _dbContext.Categories
            .Update(category);
    }
}
