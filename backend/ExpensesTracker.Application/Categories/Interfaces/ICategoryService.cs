using ExpensesTracker.Application.Categories.DTOs;

namespace ExpensesTracker.Application.Categories.Interfaces;

public interface ICategoryService
{
    Task<IReadOnlyList<CategoryDto>> GetByUserIdAsync(
        Guid userId, 
        CancellationToken cancellationToken = default);

    Task<CategoryDto?> GetByIdAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<CategoryDto> CreateAsync(
        Guid userId,
        CreateCategoryDto dto,
        CancellationToken cancellationToken = default);

    Task<CategoryDto?> UpdateAsync(
        Guid userId,
        UpdateCategoryDto dto,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken = default);
}
