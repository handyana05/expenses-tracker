using ExpensesTracker.Application.Abstractions.Authentication;
using ExpensesTracker.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ExpensesTracker.Infrastructure.Authentication;

public sealed class JwtTokenGenerator(
    IOptions<JwtOptions> options) : IJwtTokenGenerator
{
    private readonly JwtOptions _jwtOptions =
        options?.Value ?? throw new ArgumentNullException(nameof(options));

    public string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        Claim[] claims = [
            new(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()),
            new(
                ClaimTypes.Email,
                user.Email)
        ];

        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                _jwtOptions.ExpirationInMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}
