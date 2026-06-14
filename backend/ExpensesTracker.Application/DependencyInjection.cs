using ExpensesTracker.Application.Categories.Interfaces;
using ExpensesTracker.Application.Categories.Services;
using ExpensesTracker.Application.Reports.Interfaces;
using ExpensesTracker.Application.Reports.Services;
using ExpensesTracker.Application.Transactions.Interfaces;
using ExpensesTracker.Application.Transactions.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ExpensesTracker.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<ITransactionService, TransactionService>();
        services.AddScoped<IReportService, ReportService>();

        return services;
    }
}
