using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Reports.DTOs;
using ExpensesTracker.Application.Reports.Services;
using FluentAssertions;
using Moq;

namespace ExpensesTracker.Application.Tests.Reports;

public sealed class ReportServiceGetMonthlySummaryAsyncTests
{
    private readonly Mock<IReportRepository> _reportRepository = new();

    [Fact]
    public async Task Should_ReturnMonthlySummary()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var year = 2026;
        var month = 6;
        var expected = new MonthlySummaryDto(
            5000m,
            1800m,
            3200m);

        _reportRepository
            .Setup(x => x.GetMonthlySummaryAsync(
                userId,
                year,
                month,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await sut.GetMonthlySummaryAsync(
            userId,
            year,
            month);

        // Assert
        result.Should().Be(expected);

        _reportRepository.Verify(
            x => x.GetMonthlySummaryAsync(
                userId,
                year,
                month,
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private ReportService CreateSut()
        => new(_reportRepository.Object);
}
