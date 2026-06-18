using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Categories.Services;
using ExpensesTracker.Application.Common.Exceptions;
using ExpensesTracker.Domain.Entities;
using ExpensesTracker.Domain.Enums;
using FluentAssertions;
using Moq;

namespace ExpensesTracker.Application.Tests.Categories;

public sealed class CategoryServiceDeleteAsyncTests
{
    private readonly Mock<ICategoryRepository> _categoryRepository = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    [Fact]
    public async Task Should_ThrowNotFoundException_When_CategoryDoesNotExist()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();

        _categoryRepository
            .Setup(x => x.GetByIdAsync(
                categoryId,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        // Act
        Func<Task> act = async () =>
            await sut.DeleteAsync(userId, categoryId);

        // Assert
        await act.Should()
            .ThrowAsync<NotFoundException>()
            .WithMessage("Category not found.");

        _categoryRepository.Verify(
            x => x.Delete(It.IsAny<Category>()),
            Times.Never);

        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Should_DeleteCategory_When_CategoryExists()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var category = Category.Create(
            userId,
            "Food",
            CategoryType.Expense);

        _categoryRepository
            .Setup(x => x.GetByIdAsync(
                category.Id,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        // Act
        await sut.DeleteAsync(category.Id, userId);

        // Assert
        _categoryRepository.Verify(
            x => x.Delete(category),
            Times.Once);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }
    private CategoryService CreateSut()
        => new(
            _categoryRepository.Object,
            _unitOfWork.Object);
}
