
using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Categories.DTOs;
using ExpensesTracker.Application.Categories.Services;
using ExpensesTracker.Application.Common.Exceptions;
using ExpensesTracker.Domain.Entities;
using ExpensesTracker.Domain.Enums;
using FluentAssertions;
using Moq;

namespace ExpensesTracker.Application.Tests.Categories;

public sealed class CategoryServiceCreateAsyncTests
{
    private readonly Mock<ICategoryRepository> _categoryRepository = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    [Fact]
    public async Task Should_ThrowConflictException_When_CategoryAlreadyExists()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var dto = new CreateCategoryDto(
            "Food",
            CategoryType.Expense);
        _categoryRepository
            .Setup(x => x.ExistsByNameAsync(
                userId,
                dto.Name,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        Func<Task> act = async () => await sut.CreateAsync(userId, dto);

        // Assert
        await act.Should()
            .ThrowAsync<ConflictException>()
            .WithMessage("Category already exists.");
        _categoryRepository
            .Verify(x => x.AddAsync(
                    It.IsAny<Category>(),
                    It.IsAny<CancellationToken>()),
                Times.Never);
        _unitOfWork
            .Verify(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()),
                Times.Never);
    }

    private CategoryService CreateSut()
        => new(
            _categoryRepository.Object,
            _unitOfWork.Object);
}
