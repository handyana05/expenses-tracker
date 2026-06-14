using ExpensesTracker.Application.Reports.DTOs;

namespace ExpensesTracker.Application.Abstractions.Persistence;

public interface IReportRepository
{
    Task<MonthlySummaryDto> GetMonthlySummaryAsync(
        Guid userId,
        int year,
        int month,
        CancellationToken cancellationToken);
}
