using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Reports.DTOs;
using ExpensesTracker.Domain.Enums;
using ExpensesTracker.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ExpensesTracker.Infrastructure.Persistence.Repositories;

public sealed class ReportRepository(
    ExpensesTrackerDbContext dbContext) : IReportRepository
{
    private readonly ExpensesTrackerDbContext _dbContext =
        dbContext ??
        throw new ArgumentNullException(nameof(dbContext));

    public async Task<MonthlySummaryDto> GetMonthlySummaryAsync(
        Guid userId, 
        int year, 
        int month, 
        CancellationToken cancellationToken)
    {
        var query = _dbContext.Transactions
            .AsNoTracking()
            .Include(x => x.Category)
            .Where(x => x.UserId == userId &&
                x.TransactionDate.Year == year &&
                x.TransactionDate.Month == month);

        var totalIncome = await query
            .Where(x => x.Category.Type == CategoryType.Income)
            .SumAsync(x => x.Amount, cancellationToken);

        var totalExpenses = await query
            .Where(x => x.Category.Type == CategoryType.Expense)
            .SumAsync(x => x.Amount, cancellationToken);

        return new(
            totalIncome,
            totalExpenses,
            totalIncome - totalExpenses);
    }
}
