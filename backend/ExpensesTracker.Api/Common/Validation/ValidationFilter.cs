using FluentValidation;

namespace ExpensesTracker.Api.Common.Validation;

public sealed class ValidationFilter<TRequest>(
    IValidator<TRequest> validator) : IEndpointFilter
    where TRequest : class
{
    private readonly IValidator<TRequest> _validator = validator;

    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context, 
        EndpointFilterDelegate next)
    {
        var request = context.Arguments
            .OfType<TRequest>()
            .FirstOrDefault();

        if (request is null)
        {
            return await next(context);
        }

        var result = await _validator
            .ValidateAsync(request, context.HttpContext.RequestAborted);

        if (result.IsValid)
        {
            return await next(context);
        }

        return Results.ValidationProblem(
            result.Errors
                .GroupBy(x => x.PropertyName)
                .ToDictionary(x => x.Key, x => x.Select(e => e.ErrorMessage).ToArray()));
    }
}
