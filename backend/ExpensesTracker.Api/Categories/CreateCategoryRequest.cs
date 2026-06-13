using ExpensesTracker.Domain.Enums;

namespace ExpensesTracker.Api.Categories;

public sealed record CreateCategoryRequest(
    string Name,
    CategoryType Type);
