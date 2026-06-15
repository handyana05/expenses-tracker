using ExpensesTracker.Application.Abstractions.Identity;
using ExpensesTracker.Application.Reports.DTOs;
using ExpensesTracker.Application.Reports.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesTracker.Api.Reports;

public static class ReportEndpoints
{
    public static IEndpointRouteBuilder MapReportEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup(ReportRoutes.Base)
            .WithTags("Reports");

        group.MapGet("/monthly-summary", GetMonthlySummaryAsync)
            .WithName("GetMonthlySummary")
            .WithSummary("Get Monthly Summary")
            .WithDescription("Returns total income, total expenses and balance for a given month")
            .Produces<MonthlySummaryDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

        return app;
    }

    private static async Task<IResult> GetMonthlySummaryAsync(
        [FromServices] IReportService reportService,
        [FromServices] ICurrentUser currentUser,
        [FromQuery] int year,
        [FromQuery] int month,
        CancellationToken cancellationToken)
    {
        if (month < 1 || month > 12)
        {
            return Results.BadRequest("Month must between 1 and 12");
        }

        var userId = currentUser.UserId;

        var summary = await reportService
            .GetMonthlySummaryAsync(userId, year, month, cancellationToken);

        return Results.Ok(summary);
    }
}
