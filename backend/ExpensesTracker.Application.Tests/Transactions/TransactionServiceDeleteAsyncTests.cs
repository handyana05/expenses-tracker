using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Common.Exceptions;
using ExpensesTracker.Application.Transactions.Services;
using ExpensesTracker.Domain.Entities;
using ExpensesTracker.Domain.Enums;
using FluentAssertions;
using Moq;

namespace ExpensesTracker.Application.Tests.Transactions;

public sealed class TransactionServiceDeleteAsyncTests
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
        var transactionId = Guid.NewGuid();

        _transactionRepository
            .Setup(x => x.GetByIdAsync(
                transactionId,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((Transaction?)null);

        // Act
        Func<Task> act = async () =>
            await sut.DeleteAsync(userId, transactionId);

        // Assert
        await act.Should()
            .ThrowAsync<NotFoundException>()
            .WithMessage("Transaction not found.");

        _transactionRepository.Verify(
            x => x.Delete(It.IsAny<Transaction>()),
            Times.Never);

        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Should_DeleteTransaction_When_TransactionExists()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var category = Category.Create(
            userId,
            "Food",
            CategoryType.Expense);
        var transaction = Transaction.Create(
            userId,
            category.Id,
            25.50m,
            DateTimeOffset.UtcNow,
            "Groceries");


        _transactionRepository
            .Setup(x => x.GetByIdAsync(
                transaction.Id,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(transaction);

        // Act
        await sut.DeleteAsync(transaction.Id, userId);

        // Assert
        _transactionRepository.Verify(
            x => x.Delete(transaction),
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
