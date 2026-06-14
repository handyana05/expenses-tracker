using ExpensesTracker.Domain.Enums;

namespace ExpensesTracker.Api.Categories.Contracts;

public sealed record CreateCategoryRequest(
    string Name,
    CategoryType Type);
