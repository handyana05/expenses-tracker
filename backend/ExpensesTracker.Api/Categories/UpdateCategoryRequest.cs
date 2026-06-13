using ExpensesTracker.Domain.Enums;

namespace ExpensesTracker.Api.Categories;

public sealed record UpdateCategoryRequest(
    string Name,
    CategoryType Type);
