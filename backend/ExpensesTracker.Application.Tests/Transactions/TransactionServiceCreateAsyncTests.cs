using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Common.Exceptions;
using ExpensesTracker.Application.Transactions.DTOs;
using ExpensesTracker.Application.Transactions.Services;
using ExpensesTracker.Domain.Entities;
using ExpensesTracker.Domain.Enums;
using FluentAssertions;
using Moq;

namespace ExpensesTracker.Application.Tests.Transactions;

public sealed class TransactionServiceCreateAsyncTests
{
    private readonly Mock<ITransactionRepository> _transactionRepository = new();
    private readonly Mock<ICategoryRepository> _categoryRepository = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    [Fact]
    public async Task Should_ThrowNotFoundException_When_CategoryDoesNotExist()
    {
        // Assert
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var dto = new CreateTransactionDto(
            Guid.NewGuid(),
            25.50m,
            DateTimeOffset.UtcNow,
            "Groceries");

        _categoryRepository
            .Setup(x => x.GetByIdAsync(
                dto.CategoryId,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        // Act
        Func<Task> act = async () =>
            await sut.CreateAsync(userId, dto);

        // Assert
        await act.Should()
            .ThrowAsync<NotFoundException>()
            .WithMessage("Category not found.");
        _transactionRepository.Verify(
            x => x.AddAsync(
                It.IsAny<Transaction>(),
                It.IsAny<CancellationToken>()),
            Times.Never);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(
                It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Should_CreateTransaction_When_CategoryExists()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var category = Category.Create(
            userId,
            "Food",
            CategoryType.Expense);
        var dto = new CreateTransactionDto(
            category.Id,
            25.50m,
            DateTimeOffset.UtcNow,
            "Groceries");

        _categoryRepository
            .Setup(x => x.GetByIdAsync(
                dto.CategoryId,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        // Act
        var result = await sut.CreateAsync(userId, dto);

        // Assert
        result.Should().NotBeNull();
        result.CategoryId.Should().Be(category.Id);
        result.CategoryName.Should().Be(category.Name);
        result.CategoryType.Should().Be(category.Type);
        result.Amount.Should().Be(dto.Amount);
        result.TransactionDate.Should().Be(dto.TransactionDate);
        result.Description.Should().Be(dto.Description);
        _transactionRepository.Verify(
            x => x.AddAsync(
                It.Is<Transaction>(
                    transaction =>
                        transaction.UserId == userId &&
                        transaction.CategoryId == dto.CategoryId &&
                        transaction.Amount == dto.Amount &&
                        transaction.TransactionDate == dto.TransactionDate &&
                        transaction.Description == dto.Description),
                It.IsAny<CancellationToken>()),
            Times.Once);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private TransactionService CreateSut()
        => new(
            _transactionRepository.Object,
            _categoryRepository.Object,
            _unitOfWork.Object);
}
