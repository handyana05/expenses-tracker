using ExpensesTracker.Domain.Enums;

namespace ExpensesTracker.Api.Contracts.Categories;

public sealed record UpdateCategoryRequest(
    string Name,
    CategoryType Type);
