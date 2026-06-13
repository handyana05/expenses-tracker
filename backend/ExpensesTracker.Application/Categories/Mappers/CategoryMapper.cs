using ExpensesTracker.Application.Categories.DTOs;
using ExpensesTracker.Domain.Entities;

namespace ExpensesTracker.Application.Categories.Mappers;

public static class CategoryMapper
{
    public static CategoryDto ToDto(this Category category)
        => new(category.Id, category.Name, category.Type);

    public static IEnumerable<CategoryDto> ToDtos(this IEnumerable<Category> categories)
        => categories.Select(c => c.ToDto());
}
