using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Categories.DTOs;
using ExpensesTracker.Application.Categories.Interfaces;
using ExpensesTracker.Application.Categories.Mappers;
using ExpensesTracker.Domain.Entities;

namespace ExpensesTracker.Application.Categories.Services;

public sealed class CategoryService(
    ICategoryRepository categoryRepository,
    IUnitOfWork unitOfWork) : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository = 
        categoryRepository ??
        throw new ArgumentNullException(nameof(categoryRepository));
    private readonly IUnitOfWork _unitOfWork = 
        unitOfWork ??
        throw new ArgumentNullException(nameof(unitOfWork));

    public async Task<CategoryDto> CreateAsync(
        Guid userId, 
        CategoryDto dto, 
        CancellationToken cancellationToken = default)
    {
        var category = Category.Create(
            userId,
            dto.Name, 
            dto.Type);

        await _categoryRepository
            .AddAsync(category, cancellationToken);

        await _unitOfWork
            .SaveChangesAsync(cancellationToken);

        return category
            .ToDto();
    }

    public async Task<bool> DeleteAsync(
        Guid id, 
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository
            .GetByIdAsync(id, userId, cancellationToken);

        if (category is null)
        {
            return false;
        }

        _categoryRepository
            .Delete(category);

        await _unitOfWork
            .SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<CategoryDto?> GetByIdAsync(
        Guid id, 
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository
            .GetByIdAsync(id, userId, cancellationToken);
        return category?.ToDto();
    }

    public async Task<IReadOnlyList<CategoryDto>> GetByUserIdAsync(
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        var categories = await _categoryRepository
            .GetByUserIdAsync(userId, cancellationToken);
        return categories
            .ToDtos()
            .ToList();
    }

    public async Task<CategoryDto?> UpdateAsync(
        Guid userId, 
        CategoryDto dto, 
        CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository
            .GetByIdAsync(dto.Id, userId, cancellationToken);

        if (category is null)
        {
            return null;
        }

        category.Update(dto.Name, dto.Type);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return category.ToDto();
    }
}
