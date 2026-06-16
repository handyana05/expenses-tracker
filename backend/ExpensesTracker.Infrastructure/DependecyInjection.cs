using ExpensesTracker.Application.Abstractions.Authentication;
using ExpensesTracker.Application.Abstractions.Identity;
using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Infrastructure.Authentication;
using ExpensesTracker.Infrastructure.Identity;
using ExpensesTracker.Infrastructure.Persistence.Context;
using ExpensesTracker.Infrastructure.Persistence.Repositories;
using ExpensesTracker.Infrastructure.Persistence.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ExpensesTracker.Infrastructure;

public static class DependecyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ExpensesTrackerDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection")));

        services.Configure<JwtOptions>(configuration
                    .GetSection(JwtOptions.SectionName));

        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();

        services.AddScoped<ICurrentUser, CurrentUser>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<IReportRepository, ReportRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
