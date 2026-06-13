using ExpensesTracker.Domain.Enums;

namespace ExpensesTracker.Application.Categories.DTOs;

public sealed record CreateCategoryDto(
    string Name,
    CategoryType Type);
