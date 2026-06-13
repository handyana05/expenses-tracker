using ExpensesTracker.Domain.Enums;

namespace ExpensesTracker.Api.Contracts.Categories;

public sealed record CreateCategoryRequest(
    string Name,
    CategoryType Type);
