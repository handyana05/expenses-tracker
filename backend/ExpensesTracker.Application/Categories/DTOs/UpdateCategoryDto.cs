using ExpensesTracker.Domain.Enums;

namespace ExpensesTracker.Application.Categories.DTOs;

public sealed record UpdateCategoryDto(
    Guid Id,
    string Name,
    CategoryType Type);
