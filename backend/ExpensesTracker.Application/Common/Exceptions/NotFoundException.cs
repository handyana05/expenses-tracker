namespace ExpensesTracker.Application.Common.Exceptions;

public sealed class NotFoundException(
    string message) : ApplicationExceptionBase(message)
{
}
