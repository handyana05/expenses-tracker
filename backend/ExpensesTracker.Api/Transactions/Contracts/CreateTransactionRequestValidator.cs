using FluentValidation;

namespace ExpensesTracker.Api.Transactions.Contracts;

public sealed class CreateTransactionRequestValidator 
    : AbstractValidator<CreateTransactionRequest>
{
    public CreateTransactionRequestValidator()
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
