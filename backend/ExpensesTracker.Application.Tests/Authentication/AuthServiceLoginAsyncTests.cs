using ExpensesTracker.Application.Abstractions.Authentication;
using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Authentication.DTOs;
using ExpensesTracker.Application.Authentication.Services;
using ExpensesTracker.Domain.Entities;
using FluentAssertions;
using Moq;

namespace ExpensesTracker.Application.Tests.Authentication;

public sealed class AuthServiceLoginAsyncTests
{
    private readonly Mock<IUserRepository> _userRepository = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly Mock<IPasswordHasher> _passwordHasher = new();
    private readonly Mock<IJwtTokenGenerator> _jwtTokenGenerator = new();

    [Fact]
    public async Task Should_ReturnNull_When_UserDoesNotExists()
    {
        // Arrange
        var sut = CreateSut();
        var dto = new LoginDto(
            "john.doe@test.com",
            "Password123!");
        _userRepository
            .Setup(x => x.GetByEmailAsync(
                dto.Email,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        // Act
        var result = await sut.LoginAsync(dto);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task Should_ReturnNull_When_PasswordIsInvalid()
    {
        var sut = CreateSut();
        var user = User.Create(
            "john.doe@test.com",
            "hashed-password",
            "John Doe");
        var dto = new LoginDto(
            user.Email,
            "WrongPassword");
        _userRepository
            .Setup(x => x.GetByEmailAsync(
                dto.Email,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _passwordHasher
            .Setup(x => x.VerifyPassword(
                user,
                dto.Password))
            .Returns(false);

        // Act
        var result = await sut.LoginAsync(dto);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task Should_ReturnAuthResult_When_CredentialsAreValid()
    {
        // Arrange
        var sut = CreateSut();
        var user = User.Create(
            "john.doe@test.com",
            "hashed-password",
            "John Doe");
        var dto = new LoginDto(
            user.Email,
            "Password123!");

        _userRepository
            .Setup(x => x.GetByEmailAsync(
                dto.Email,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _passwordHasher
            .Setup(x => x.VerifyPassword(
                user,
                dto.Password))
            .Returns(true);
        _jwtTokenGenerator
            .Setup(x => x.GenerateToken(user))
            .Returns("jwt-token");

        // Act
        var result = await sut.LoginAsync(dto);

        // Assert
        result.Should().NotBeNull();

        result!.Email.Should().Be(user.Email);
        result.DisplayName.Should().Be(user.DisplayName);
        result.AccessToken.Should().Be("jwt-token");
    }

    private AuthService CreateSut()
        => new(
            _userRepository.Object,
            _unitOfWork.Object,
            _passwordHasher.Object,
            _jwtTokenGenerator.Object);
}
