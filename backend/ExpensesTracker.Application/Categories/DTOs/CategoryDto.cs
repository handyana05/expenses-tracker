using ExpensesTracker.Domain.Enums;

namespace ExpensesTracker.Application.Categories.DTOs;

public sealed record CategoryDto(
    Guid Id,
    string Name,
    CategoryType Type);
