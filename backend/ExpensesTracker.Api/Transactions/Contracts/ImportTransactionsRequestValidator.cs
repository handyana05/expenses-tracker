using FluentValidation;

namespace ExpensesTracker.Api.Transactions.Contracts;

public sealed class ImportTransactionsRequestValidator
    : AbstractValidator<ImportTransactionsRequest>
{
    public ImportTransactionsRequestValidator()
    {
        RuleFor(x => x.Transactions)
            .NotEmpty()
            .Must(x => x.Count <= 500)
            .WithMessage("A CSV import cannot contain more than 500 transactions.");

        RuleForEach(x => x.Transactions)
            .SetValidator(new ImportTransactionItemRequestValidator());
    }
}

public sealed class ImportTransactionItemRequestValidator
    : AbstractValidator<ImportTransactionItemRequest>
{
    public ImportTransactionItemRequestValidator()
    {
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0);
        RuleFor(x => x.TransactionDate).NotEmpty();
        RuleFor(x => x.Description).MaximumLength(500);
    }
}
