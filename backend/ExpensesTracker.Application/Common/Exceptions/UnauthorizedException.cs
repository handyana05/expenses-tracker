namespace ExpensesTracker.Application.Common.Exceptions;

public sealed class UnauthorizedException(
    string message) : ApplicationExceptionBase(message)
{
}
