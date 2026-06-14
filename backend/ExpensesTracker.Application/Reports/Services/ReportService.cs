using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Reports.DTOs;
using ExpensesTracker.Application.Reports.Interfaces;

namespace ExpensesTracker.Application.Reports.Services;

public sealed class ReportService(
    IReportRepository reportRepository) : IReportService
{
    private readonly IReportRepository _reportRepository =
        reportRepository ?? throw new ArgumentNullException(nameof(reportRepository));

    public async Task<MonthlySummaryDto> GetMonthlySummaryAsync(
        Guid userId, 
        int year, 
        int month, 
        CancellationToken cancellationToken = default)
    {
        return await _reportRepository
            .GetMonthlySummaryAsync(userId, year, month, cancellationToken);
    }
}
