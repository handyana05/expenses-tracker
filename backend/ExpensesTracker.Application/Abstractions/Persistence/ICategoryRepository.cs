using ExpensesTracker.Domain.Entities;

namespace ExpensesTracker.Application.Abstractions.Persistence;

public interface ICategoryRepository
{
    Task<IReadOnlyList<Category>> GetByUserIdAsync(
        Guid userId, 
        CancellationToken cancellationToken = default);
    Task<Category?> GetByIdAsync(
        Guid id, 
        Guid userId, 
        CancellationToken cancellationToken = default);
    Task AddAsync(
        Category category, 
        CancellationToken cancellationToken = default);
    void Update(Category category);
    void Delete(Category category);
    Task<bool> ExistsByNameAsync(
        Guid userId,
        string name,
        CancellationToken cancellationToken = default);
    Task<bool> ExistsByNameAsync(
        Guid userId,
        string name,
        Guid excludeCategoryId,
        CancellationToken cancellationToken = default);
}
