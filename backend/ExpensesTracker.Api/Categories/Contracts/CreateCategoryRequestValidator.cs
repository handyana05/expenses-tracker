using FluentValidation;

namespace ExpensesTracker.Api.Categories.Contracts;

public sealed class CreateCategoryRequestValidator 
    : AbstractValidator<CreateCategoryRequest>
{
    public CreateCategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Type)
            .IsInEnum();
    }
}
