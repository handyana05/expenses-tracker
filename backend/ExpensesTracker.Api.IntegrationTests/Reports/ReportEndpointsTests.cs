using ExpensesTracker.Api.Categories.Contracts;
using ExpensesTracker.Api.IntegrationTests.Common;
using ExpensesTracker.Api.Transactions.Contracts;
using ExpensesTracker.Application.Categories.DTOs;
using ExpensesTracker.Application.Reports.DTOs;
using ExpensesTracker.Domain.Enums;
using FluentAssertions;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace ExpensesTracker.Api.IntegrationTests.Reports;

public sealed class ReportEndpointsTests(
    ExpenseTrackerApiFactory factory) : IClassFixture<ExpenseTrackerApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Should_ReturnMonthlySummary()
    {
        var token = await TestAuthHelper.RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var incomeCategory = await CreateCategoryAsync(
            "Salary",
            CategoryType.Income);

        var expenseCategory = await CreateCategoryAsync(
            "Food",
            CategoryType.Expense);

        var transactionDate = new DateTimeOffset(
            2026, 6, 15, 0, 0, 0, TimeSpan.Zero);

        await CreateTransactionAsync(
            incomeCategory.Id,
            5000m,
            transactionDate);

        await CreateTransactionAsync(
            expenseCategory.Id,
            1200m,
            transactionDate);

        var response = await _client.GetAsync(
            "/api/reports/monthly-summary?year=2026&month=6");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var summary = await response.Content
            .ReadFromJsonAsync<MonthlySummaryDto>();

        summary.Should().NotBeNull();
        summary!.TotalIncome.Should().Be(5000m);
        summary.TotalExpense.Should().Be(1200m);
        summary.Balance.Should().Be(3800m);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_MonthIsInvalid()
    {
        var token = await TestAuthHelper.RegisterAndGetTokenAsync(_client);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.GetAsync(
            "/api/reports/monthly-summary?year=2026&month=13");

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    private async Task<CategoryDto> CreateCategoryAsync(
        string name,
        CategoryType type)
    {
        var response = await _client.PostAsJsonAsync(
            "/api/categories",
            new CreateCategoryRequest(name, type));

        response.EnsureSuccessStatusCode();

        return (await response.Content
            .ReadFromJsonAsync<CategoryDto>())!;
    }

    private async Task CreateTransactionAsync(
        Guid categoryId,
        decimal amount,
        DateTimeOffset transactionDate)
    {
        var response = await _client.PostAsJsonAsync(
            "/api/transactions",
            new CreateTransactionRequest(
                categoryId,
                amount,
                transactionDate,
                null));

        response.EnsureSuccessStatusCode();
    }
}
