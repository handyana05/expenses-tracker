using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Common.Exceptions;
using ExpensesTracker.Application.Transactions.DTOs;
using ExpensesTracker.Application.Transactions.Services;
using ExpensesTracker.Domain.Entities;
using ExpensesTracker.Domain.Enums;
using FluentAssertions;
using Moq;

namespace ExpensesTracker.Application.Tests.Transactions;

public sealed class TransactionServiceUpdateAsyncTests
{
    private readonly Mock<ITransactionRepository> _transactionRepository = new();
    private readonly Mock<ICategoryRepository> _categoryRepository = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    [Fact]
    public async Task Should_ThrowNotFoundException_When_TransactionDoesNotExist()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var dto = new UpdateTransactionDto(
            Guid.NewGuid(),
            Guid.NewGuid(),
            25.50m,
            DateTimeOffset.UtcNow,
            "Groceries");

        _transactionRepository
            .Setup(x => x.GetByIdAsync(
                dto.Id,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((Transaction?)null);

        // Act
        Func<Task> act = async () =>
            await sut.UpdateAsync(userId, dto);

        // Assert
        await act.Should()
            .ThrowAsync<NotFoundException>()
            .WithMessage("Transaction not found.");
        _categoryRepository.Verify(
            x => x.GetByIdAsync(
                It.IsAny<Guid>(),
                It.IsAny<Guid>(),
                It.IsAny<CancellationToken>()),
            Times.Never);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Should_ThrowNotFoundException_When_CategoryDoesNotExist()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var oldCategoryId = Guid.NewGuid();
        var newCategoryId = Guid.NewGuid();
        var transaction = Transaction.Create(
            userId,
            oldCategoryId,
            10m,
            DateTimeOffset.UtcNow.AddDays(-1),
            "Old transaction");
        var dto = new UpdateTransactionDto(
            transaction.Id,
            newCategoryId,
            25.50m,
            DateTimeOffset.UtcNow,
            "Groceries");

        _transactionRepository
            .Setup(x => x.GetByIdAsync(
                dto.Id,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(transaction);

        _categoryRepository
            .Setup(x => x.GetByIdAsync(
                dto.CategoryId,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        // Act
        Func<Task> act = async () =>
            await sut.UpdateAsync(userId, dto);

        // Assert
        await act.Should()
            .ThrowAsync<NotFoundException>()
            .WithMessage("Category not found.");
        _transactionRepository.Verify(
            x => x.Update(It.IsAny<Transaction>()),
            Times.Never);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Should_UpdateTransaction_When_TransactionAndCategoryExist()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var oldCategory = Category.Create(
            userId,
            "Transport",
            CategoryType.Expense);
        var newCategory = Category.Create(
            userId,
            "Food",
            CategoryType.Expense);
        var transaction = Transaction.Create(
            userId,
            oldCategory.Id,
            10m,
            DateTimeOffset.UtcNow.AddDays(-1),
            "Old transaction");
        var dto = new UpdateTransactionDto(
            transaction.Id,
            newCategory.Id,
            25.50m,
            DateTimeOffset.UtcNow,
            "Groceries");

        _transactionRepository
            .Setup(x => x.GetByIdAsync(
                dto.Id,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(transaction);

        _categoryRepository
            .Setup(x => x.GetByIdAsync(
                dto.CategoryId,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(newCategory);

        // ACt
        var result = await sut.UpdateAsync(userId, dto);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(transaction.Id);
        result.CategoryId.Should().Be(newCategory.Id);
        result.CategoryName.Should().Be(newCategory.Name);
        result.CategoryType.Should().Be(newCategory.Type);
        result.Amount.Should().Be(dto.Amount);
        result.TransactionDate.Should().Be(dto.TransactionDate);
        result.Description.Should().Be(dto.Description);

        _transactionRepository.Verify(
            x => x.Update(transaction),
            Times.Once);

        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private TransactionService CreateSut()
        => new(
            _transactionRepository.Object,
            _categoryRepository.Object,
            _unitOfWork.Object);
}
