using ExpensesTracker.Api.Authentication.Contracts;
using ExpensesTracker.Application.Authentication.DTOs;
using System.Net.Http.Json;

namespace ExpensesTracker.Api.IntegrationTests.Common;

public static class TestAuthHelper
{
    public static async Task<string> RegisterAndGetTokenAsync(
        HttpClient httpClient)
    {
        var email = $"{Guid.NewGuid()}@test.com";
        var password = "Password123!";
        var request = new RegisterRequest(email, password, "Test User");
        var response = await httpClient.PostAsJsonAsync(
            "/api/auth/register",
            request);

        response.EnsureSuccessStatusCode();

        var result = await response.Content
            .ReadFromJsonAsync<AuthResultDto>();

        return result!.AccessToken;
    }
}
