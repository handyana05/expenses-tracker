using ExpensesTracker.Api.Categories.Contracts;
using ExpensesTracker.Application.Abstractions.Identity;
using ExpensesTracker.Application.Categories.DTOs;
using ExpensesTracker.Application.Categories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesTracker.Api.Categories;

public static class CategoryEndpoints
{
    public static IEndpointRouteBuilder MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup(CategoryRoutes.Base)
            .WithTags("Categories");

        group.MapGet("/", GetCategoriesAsync)
            .WithName("GetCategories")
            .WithSummary("Get all categories")
            .WithDescription("Retrieves all income and expense categories that belong to the current user.")
            .Produces<IEnumerable<CategoryDto>>(StatusCodes.Status200OK);

        group.MapGet("/{id:guid}", GetCategoryByIdAsync)
            .WithName("GetCategoryById")
            .WithSummary("Get category by ID")
            .WithDescription("Retrieves a specific category by its ID that belongs to the current user.")
            .Produces<CategoryDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/", CreateCategoryAsync)
            .WithName("CreateCategory")
            .WithSummary("Create a category")
            .WithDescription("Creates a new income or expense category for the current user.")
            .Produces<CategoryDto>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest);

        group.MapPut("/{id:guid}", UpdateCategoryAsync)
            .WithName("UpdateCategory")
            .WithSummary("Update a category")
            .WithDescription("Updates the name and type of an existing category for the current user.")
            .Produces<CategoryDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest);

        group.MapDelete("/{id:guid}", DeleteCategoryAsync)
            .WithName("DeleteCategory")
            .WithSummary("Delete a category")
            .WithDescription("Deletes a category if it belongs to the current user.")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        return app;
    }

    private static async Task<IResult> GetCategoriesAsync(
        [FromServices] ICategoryService categoryService,
        [FromServices] ICurrentUser currentUser,
        CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;

        var categories = await categoryService
            .GetByUserIdAsync(userId, cancellationToken);

        return Results.Ok(categories);
    }

    private static async Task<IResult> GetCategoryByIdAsync(
        [FromServices] ICategoryService categoryService,
        [FromServices] ICurrentUser currentUser,
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        var category = await categoryService
            .GetByIdAsync(id, userId, cancellationToken);
        return category is not null
            ? Results.Ok(category)
            : Results.NotFound();
    }

    private static async Task<IResult> CreateCategoryAsync(
        [FromServices] ICategoryService categoryService,
        [FromServices] ICurrentUser currentUser,
        [FromBody] CreateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        var dto = new CreateCategoryDto(
            request.Name,
            request.Type);
        var createdCategory = await categoryService
            .CreateAsync(userId, dto, cancellationToken);
        return Results.CreatedAtRoute(
            "GetCategoryById",
            new { id = createdCategory.Id },
            createdCategory);
    }

    private static async Task<IResult> UpdateCategoryAsync(
        [FromServices] ICategoryService categoryService,
        [FromServices] ICurrentUser currentUser,
        [FromRoute] Guid id,
        [FromBody] UpdateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        var dto = new UpdateCategoryDto(
            id,
            request.Name,
            request.Type);
        var updatedCategory = await categoryService
            .UpdateAsync(userId, dto, cancellationToken);
        return updatedCategory is not null
            ? Results.Ok(updatedCategory)
            : Results.NotFound();
    }

    private static async Task<IResult> DeleteCategoryAsync(
        [FromServices] ICategoryService categoryService,
        [FromServices] ICurrentUser currentUser,
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        var isDeleted = await categoryService
            .DeleteAsync(id, userId, cancellationToken);
        return isDeleted
            ? Results.NoContent()
            : Results.NotFound();
    }
}
