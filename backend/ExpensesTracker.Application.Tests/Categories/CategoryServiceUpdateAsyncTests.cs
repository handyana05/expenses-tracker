using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Categories.DTOs;
using ExpensesTracker.Application.Categories.Services;
using ExpensesTracker.Application.Common.Exceptions;
using ExpensesTracker.Domain.Entities;
using ExpensesTracker.Domain.Enums;
using FluentAssertions;
using Moq;

namespace ExpensesTracker.Application.Tests.Categories;

public sealed class CategoryServiceUpdateAsyncTests
{
    private readonly Mock<ICategoryRepository> _categoryRepository = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    [Fact]
    public async Task Should_ThrowNotFoundException_When_CategoryDoesNotExists()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var dto = new UpdateCategoryDto(
            Guid.NewGuid(),
            "Food",
            CategoryType.Expense);
        _categoryRepository
            .Setup(x => x.GetByIdAsync(
                dto.Id,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        // Act
        Func<Task> act = async () => await sut.UpdateAsync(userId, dto);

        // Assert
        await act.Should()
            .ThrowAsync<NotFoundException>()
            .WithMessage("Category not found.");
        _categoryRepository
            .Verify(x => x.ExistsByNameAsync(
                    It.IsAny<Guid>(),
                    It.IsAny<string>(),
                    It.IsAny<Guid>(),
                    It.IsAny<CancellationToken>()),
                Times.Never);
        _unitOfWork
            .Verify(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()),
                Times.Never);
    }

    [Fact]
    public async Task Should_ThrowConflictException_When_CategoryNameAlreadyExists()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var category = Category.Create(
            userId,
            "Transport",
            CategoryType.Expense);
        var dto = new UpdateCategoryDto(
            category.Id,
            "Food",
            CategoryType.Expense);

        _categoryRepository
            .Setup(x => x.GetByIdAsync(
                dto.Id,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        _categoryRepository
            .Setup(x => x.ExistsByNameAsync(
                userId,
                dto.Name,
                category.Id,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        Func<Task> act = async () => await sut.UpdateAsync(userId, dto);

        // Assert
        await act.Should()
            .ThrowAsync<ConflictException>()
            .WithMessage("Category already exists.");

        _unitOfWork
            .Verify(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()),
                Times.Never);
    }

    [Fact]
    public async Task Should_UpdateCategory_When_CategoryExists()
    {
        // Arrange
        var sut = CreateSut();
        var userId = Guid.NewGuid();
        var category = Category.Create(
            userId,
            "Transport",
            CategoryType.Expense);
        var dto = new UpdateCategoryDto(
            category.Id,
            "Food",
            CategoryType.Expense);

        _categoryRepository
            .Setup(x => x.GetByIdAsync(
                dto.Id,
                userId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        _categoryRepository
            .Setup(x => x.ExistsByNameAsync(
                userId,
                dto.Name,
                category.Id,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await sut.UpdateAsync(userId, dto);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(category.Id);
        result.Name.Should().Be(dto.Name);
        result.Type.Should().Be(dto.Type);
        _unitOfWork
            .Verify(x => x.SaveChangesAsync(
                    It.IsAny<CancellationToken>()),
                Times.Once);
    }

    private CategoryService CreateSut()
        => new(
            _categoryRepository.Object,
            _unitOfWork.Object);
}
