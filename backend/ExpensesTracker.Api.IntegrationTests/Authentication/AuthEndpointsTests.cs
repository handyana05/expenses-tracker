using ExpensesTracker.Api.Authentication.Contracts;
using ExpensesTracker.Api.IntegrationTests.Common;
using ExpensesTracker.Application.Authentication.DTOs;
using FluentAssertions;
using System.Net;
using System.Net.Http.Json;

namespace ExpensesTracker.Api.IntegrationTests.Authentication;

public sealed class AuthEndpointsTests(
    ExpenseTrackerApiFactory factory)
    : IClassFixture<ExpenseTrackerApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Register_Should_CreateUser_And_ReturnAccessToken()
    {
        // Arrange
        var request = new RegisterRequest(
            "test@example.com",
            "Password123!",
            "Test User");

        // Act
        var response = await _client.PostAsJsonAsync(
            "/api/auth/register",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadFromJsonAsync<AuthResultDto>();

        content.Should().NotBeNull();
        content!.Email.Should().Be(request.Email);
        content.DisplayName.Should().Be(request.DisplayName);
        content.AccessToken.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Login_Should_ReturnAccessToken_When_CredentialsAreValid()
    {
        // Arrange
        var registerRequest = new RegisterRequest(
            "login@example.com",
            "Password123!",
            "Login User");

        await _client.PostAsJsonAsync(
            "/api/auth/register",
            registerRequest);

        var loginRequest = new LoginRequest(
            registerRequest.Email,
            registerRequest.Password);

        // Act
        var response = await _client.PostAsJsonAsync(
            "/api/auth/login",
            loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadFromJsonAsync<AuthResultDto>();

        content.Should().NotBeNull();
        content!.AccessToken.Should().NotBeNullOrWhiteSpace();
    }
}
