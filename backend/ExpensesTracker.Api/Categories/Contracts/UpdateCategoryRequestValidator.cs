using FluentValidation;

namespace ExpensesTracker.Api.Categories.Contracts;

public sealed class UpdateCategoryRequestValidator 
    : AbstractValidator<UpdateCategoryRequest>
{
    public UpdateCategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Type)
            .IsInEnum();
    }
}
