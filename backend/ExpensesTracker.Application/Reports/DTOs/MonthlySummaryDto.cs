namespace ExpensesTracker.Application.Reports.DTOs;

public sealed record MonthlySummaryDto(
    decimal TotalIncome,
    decimal TotalExpenses,
    decimal Balance);
