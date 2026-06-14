using ExpensesTracker.Domain.Enums;

namespace ExpensesTracker.Api.Categories.Contracts;

public sealed record UpdateCategoryRequest(
    string Name,
    CategoryType Type);
