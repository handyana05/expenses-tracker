using ExpensesTracker.Application.Reports.DTOs;

namespace ExpensesTracker.Application.Reports.Interfaces;

public interface IReportService
{
    Task<MonthlySummaryDto> GetMonthlySummaryAsync(
        Guid userId,
        int year,
        int month,
        CancellationToken cancellationToken = default);
}
