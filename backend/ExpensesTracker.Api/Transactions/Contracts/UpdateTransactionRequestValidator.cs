using FluentValidation;

namespace ExpensesTracker.Api.Transactions.Contracts;

public sealed class UpdateTransactionRequestValidator
    : AbstractValidator<UpdateTransactionRequest>
{
    public UpdateTransactionRequestValidator()
    {
        RuleFor(x => x.CategoryId)
            .NotEmpty();

        RuleFor(x => x.Amount)
            .GreaterThan(0);

        RuleFor(x => x.TransactionDate)
            .NotEmpty();

        RuleFor(x => x.Description)
            .MaximumLength(500);
    }
}
