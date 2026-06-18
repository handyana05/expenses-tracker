using ExpensesTracker.Application.Abstractions.Authentication;
using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Authentication.DTOs;
using ExpensesTracker.Application.Authentication.Services;
using ExpensesTracker.Application.Common.Exceptions;
using ExpensesTracker.Domain.Entities;
using FluentAssertions;
using Moq;

namespace ExpensesTracker.Application.Tests.Authentication;

public sealed class AuthServiceRegisterAsyncTests
{
    private readonly Mock<IUserRepository> _userRepository = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly Mock<IPasswordHasher> _passwordHasher = new();
    private readonly Mock<IJwtTokenGenerator> _jwtTokenGenerator = new();

    [Fact]
    public async Task Should_ThrowConflictException_WhenUserAlreadyExists()
    {
        // Arrange
        var sut = CreateSut();
        var dto = new RegisterDto(
            "john.doe@test.com",
            "Password123!",
            "John Doe");
        _userRepository
            .Setup(x => x.GetByEmailAsync(
                dto.Email,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(User.Create(
                dto.Email,
                "hashed-password"));

        // Act
        Func<Task> act = async () => await sut.RegisterAsync(dto);

        // Assert
        await act.Should()
            .ThrowAsync<ConflictException>()
            .WithMessage("User already exists.");
    }

    [Fact]
    public async Task Should_CreateUser_WhenUserDoesNotExists()
    {
        // Arrange
        var sut = CreateSut();
        var dto = new RegisterDto(
            "john.doe@test.com",
            "Password123!",
            "John Doe");
        _userRepository
            .Setup(x => x.GetByEmailAsync(
                dto.Email,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        _passwordHasher
            .Setup(x => x.HashPassword(
                It.IsAny<User>(),
                dto.Password))
            .Returns("hashed-password");

        _jwtTokenGenerator
            .Setup(x => x.GenerateToken(
                It.IsAny<User>()))
            .Returns("jwt-token");

        // Act
        var result = await sut.RegisterAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be(dto.Email);
        _userRepository.Verify(
            x => x.AddAsync(
                It.IsAny<User>(),
                It.IsAny<CancellationToken>()),
            Times.Once);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private AuthService CreateSut()
        => new(
            _userRepository.Object,
            _unitOfWork.Object,
            _passwordHasher.Object,
            _jwtTokenGenerator.Object);
}
