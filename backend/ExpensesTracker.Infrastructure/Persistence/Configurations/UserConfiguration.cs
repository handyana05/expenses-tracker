using ExpensesTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExpensesTracker.Infrastructure.Persistence.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(320);

        builder.Property(x => x.PasswordHash)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.CreatedAtUtc)
            .IsRequired();

        builder.HasIndex(x => x.Email)
            .IsUnique();

        builder.HasData(
            new
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Email = "demo@example.com",
                PasswordHash = "temporary-password-hash",
                CreatedAtUtc = new DateTimeOffset(
                2026, 1, 1, 0, 0, 0, TimeSpan.Zero)
            });
    }
}
