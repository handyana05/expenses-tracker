using ExpensesTracker.Api.Categories.Contracts;
using ExpensesTracker.Api.IntegrationTests.Common;
using ExpensesTracker.Application.Categories.DTOs;
using ExpensesTracker.Domain.Enums;
using FluentAssertions;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace ExpensesTracker.Api.IntegrationTests.Categories;

public sealed class CategoryEndpointsTests(
    ExpenseTrackerApiFactory factory)
    : IClassFixture<ExpenseTrackerApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task CreateCategory_Should_ReturnCreatedCategory_When_RequestIsValid()
    {
        // Arrange
        var token = await TestAuthHelper.RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var request = new CreateCategoryRequest(
            "Food",
            CategoryType.Expense);

        // Act
        var response = await _client.PostAsJsonAsync(
            "/api/categories",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var category = await response.Content
            .ReadFromJsonAsync<CategoryDto>();

        category.Should().NotBeNull();
        category!.Name.Should().Be(request.Name);
        category.Type.Should().Be(request.Type);
    }

    [Fact]
    public async Task GetCategories_Should_ReturnCreatedCategories()
    {
        // Arrange
        var token = await TestAuthHelper.RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        // Act
        await _client.PostAsJsonAsync(
            "/api/categories",
            new CreateCategoryRequest("Food", CategoryType.Expense));
                
        var response = await _client.GetAsync("/api/categories");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var categories = await response.Content
            .ReadFromJsonAsync<IReadOnlyList<CategoryDto>>();

        categories.Should().NotBeNull();
        categories!.Should().ContainSingle(x => x.Name == "Food");
    }

    [Fact]
    public async Task Should_ReturnUnauthorized_When_UserIsNotAuthenticated()
    {
        // Act
        var response = await _client.GetAsync("/api/categories");

        // Assert
        response.StatusCode.Should()
            .Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Should_ReturnConflict_When_CategoryAlreadyExists()
    {
        // Arrange
        var token = await TestAuthHelper
            .RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var request = new CreateCategoryRequest(
            "Food",
            CategoryType.Expense);

        await _client.PostAsJsonAsync(
            "/api/categories",
            request);

        // Act
        var response = await _client.PostAsJsonAsync(
            "/api/categories",
            request);

        // Assert
        response.StatusCode.Should()
            .Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Should_UpdateCategory_When_CategoryExists()
    {
        // Arrange
        var token = await TestAuthHelper.RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var createResponse = await _client.PostAsJsonAsync(
            "/api/categories",
            new CreateCategoryRequest("Food", CategoryType.Expense));

        var createdCategory = await createResponse.Content
            .ReadFromJsonAsync<CategoryDto>();

        var updateRequest = new UpdateCategoryRequest(
            "Groceries",
            CategoryType.Expense);

        // Act
        var response = await _client.PutAsJsonAsync(
            $"/api/categories/{createdCategory!.Id}",
            updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var updatedCategory = await response.Content
            .ReadFromJsonAsync<CategoryDto>();

        updatedCategory.Should().NotBeNull();
        updatedCategory!.Id.Should().Be(createdCategory.Id);
        updatedCategory.Name.Should().Be(updateRequest.Name);
        updatedCategory.Type.Should().Be(updateRequest.Type);
    }

    [Fact]
    public async Task Should_DeleteCategory_When_CategoryExists()
    {
        // Arrange
        var token = await TestAuthHelper.RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var createResponse = await _client.PostAsJsonAsync(
            "/api/categories",
            new CreateCategoryRequest("Food", CategoryType.Expense));

        var createdCategory = await createResponse.Content
            .ReadFromJsonAsync<CategoryDto>();

        // Act
        var response = await _client.DeleteAsync(
            $"/api/categories/{createdCategory!.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync(
            $"/api/categories/{createdCategory.Id}");

        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Should_ReturnNotFound_When_DeletingUnknownCategory()
    {
        // Arrange
        var token = await TestAuthHelper.RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.DeleteAsync(
            $"/api/categories/{Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
