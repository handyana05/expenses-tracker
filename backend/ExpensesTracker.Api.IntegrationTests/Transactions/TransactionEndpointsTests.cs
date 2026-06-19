using ExpensesTracker.Api.Categories.Contracts;
using ExpensesTracker.Api.IntegrationTests.Common;
using ExpensesTracker.Api.Transactions.Contracts;
using ExpensesTracker.Application.Categories.DTOs;
using ExpensesTracker.Application.Transactions.DTOs;
using ExpensesTracker.Domain.Enums;
using FluentAssertions;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace ExpensesTracker.Api.IntegrationTests.Transactions;

public sealed class TransactionEndpointsTests(
    ExpenseTrackerApiFactory factory)
    : IClassFixture<ExpenseTrackerApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Should_CreateTransaction_When_CategoryExists()
    {
        // Arrange
        var token = await TestAuthHelper.RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var category = await CreateCategoryAsync();

        var request = new CreateTransactionRequest(
            category.Id,
            25.50m,
            DateTimeOffset.UtcNow,
            "Groceries");

        // Act
        var response = await _client.PostAsJsonAsync(
            "/api/transactions",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var transaction = await response.Content
            .ReadFromJsonAsync<TransactionDto>();

        transaction.Should().NotBeNull();
        transaction!.CategoryId.Should().Be(category.Id);
        transaction.CategoryName.Should().Be(category.Name);
        transaction.Amount.Should().Be(request.Amount);
        transaction.Description.Should().Be(request.Description);
    }

    [Fact]
    public async Task Should_ReturnNotFound_When_CategoryDoesNotExist()
    {
        // Arrange
        var token = await TestAuthHelper.RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var request = new CreateTransactionRequest(
            Guid.NewGuid(),
            25.50m,
            DateTimeOffset.UtcNow,
            "Groceries");

        // Act
        var response = await _client.PostAsJsonAsync(
            "/api/transactions",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Should_UpdateTransaction_When_TransactionExists()
    {
        // Arrange
        var token = await TestAuthHelper.RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var category = await CreateCategoryAsync();
        var transaction = await CreateTransactionAsync(category.Id);

        var updateRequest = new UpdateTransactionRequest(
            category.Id,
            99.99m,
            DateTimeOffset.UtcNow,
            "Updated transaction");

        // Act
        var response = await _client.PutAsJsonAsync(
            $"/api/transactions/{transaction.Id}",
            updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var updatedTransaction = await response.Content
            .ReadFromJsonAsync<TransactionDto>();

        updatedTransaction.Should().NotBeNull();
        updatedTransaction!.Id.Should().Be(transaction.Id);
        updatedTransaction.Amount.Should().Be(updateRequest.Amount);
        updatedTransaction.Description.Should().Be(updateRequest.Description);
    }

    [Fact]
    public async Task Should_DeleteTransaction_When_TransactionExists()
    {
        // Arrange
        var token = await TestAuthHelper.RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var category = await CreateCategoryAsync();
        var transaction = await CreateTransactionAsync(category.Id);

        // Act
        var response = await _client.DeleteAsync(
            $"/api/transactions/{transaction.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync(
            $"/api/transactions/{transaction.Id}");

        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    private async Task<CategoryDto> CreateCategoryAsync()
    {
        var response = await _client.PostAsJsonAsync(
            "/api/categories",
            new CreateCategoryRequest("Food", CategoryType.Expense));

        response.EnsureSuccessStatusCode();

        return (await response.Content
            .ReadFromJsonAsync<CategoryDto>())!;
    }

    private async Task<TransactionDto> CreateTransactionAsync(Guid categoryId)
    {
        var response = await _client.PostAsJsonAsync(
            "/api/transactions",
            new CreateTransactionRequest(
                categoryId,
                25.50m,
                DateTimeOffset.UtcNow,
                "Groceries"));

        response.EnsureSuccessStatusCode();

        return (await response.Content
            .ReadFromJsonAsync<TransactionDto>())!;
    }
}
