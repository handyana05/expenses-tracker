using ExpensesTracker.Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;

namespace ExpensesTracker.Api.IntegrationTests.Common;

public sealed class ExpenseTrackerApiFactory
    : WebApplicationFactory<Program>, 
    IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgresContainer =
        new PostgreSqlBuilder("postgres:16")
            .WithDatabase("ExpenseTrackerTestDb")
            .WithUsername("postgres")
            .WithPassword("postgres")
            .Build();

    public ExpenseTrackerApiFactory()
    {
        Environment.SetEnvironmentVariable("Jwt__Issuer", "ExpenseTracker");
        Environment.SetEnvironmentVariable("Jwt__Audience", "ExpenseTracker.Client");
        Environment.SetEnvironmentVariable("Jwt__SecretKey", "THIS_IS_A_TEST_SECRET_KEY_WITH_AT_LEAST_32_CHARS_123456");
        Environment.SetEnvironmentVariable("Jwt__ExpirationInMinutes", "60");
    }

    public async Task InitializeAsync()
    {
        await _postgresContainer.StartAsync();

        using var scope = Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<ExpensesTrackerDbContext>();

        await dbContext.Database.MigrateAsync();
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await _postgresContainer.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            var dbContextDescriptor = services.SingleOrDefault(
                services => services.ServiceType ==
                    typeof(DbContextOptions<ExpensesTrackerDbContext>));

            if (dbContextDescriptor is not null)
            {
                services.Remove(dbContextDescriptor);
            }

            services.AddDbContext<ExpensesTrackerDbContext>(options =>
            {
                options.UseNpgsql(_postgresContainer.GetConnectionString());
            });
        });
    }
}
