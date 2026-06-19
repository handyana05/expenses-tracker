using ExpensesTracker.Api.Common.Validation;
using ExpensesTracker.Api.Transactions.Contracts;
using ExpensesTracker.Application.Abstractions.Identity;
using ExpensesTracker.Application.Transactions.DTOs;
using ExpensesTracker.Application.Transactions.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesTracker.Api.Transactions;

public static class TransactionEndpoints
{
    public static IEndpointRouteBuilder MapTransactionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup(TransactionRoutes.Base)
            .WithTags("Transactions")
            .RequireAuthorization();

        group.MapGet("/", GetTransactionsAsync)
            .WithName("GetTransactions")
            .WithSummary("Get all transactions")
            .WithDescription("Retrieves all transactions that belong to the current user.")
            .Produces<IEnumerable<TransactionDto>>(StatusCodes.Status200OK);

        group.MapGet("/{id:guid}", GetTransactionByIdAsync)
            .WithName("GetTransactionById")
            .WithSummary("Get a transaction by ID")
            .WithDescription("Retrieves a transaction by its unique identifier that belong to the current user.")
            .Produces<TransactionDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/", CreateTransactionAsync)
            .WithName("CreateTransaction")
            .WithSummary("Create a transaction")
            .WithDescription("Creates a new income or expense transaction for the current user.")
            .Produces<TransactionDto>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .AddEndpointFilter<ValidationFilter<CreateTransactionRequest>>();

        group.MapPut("/{id:guid}", UpdateTransactionAsync)
            .WithName("UpdateTransaction")
            .WithSummary("Update a transaction")
            .WithDescription("Updates an existing transaction")
            .Produces<TransactionDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest)
            .AddEndpointFilter<ValidationFilter<UpdateTransactionRequest>>();

        group.MapDelete("/{id:guid}", DeleteTransactionAsync)
            .WithName("DeleteTransaction")
            .WithSummary("Delete a transaction")
            .WithDescription("Deletes a transaction owned by the current user. Returns 404 if the transaction does not exist or is not accessible to the current user.")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        return app;
    }

    private static async Task<IResult> GetTransactionsAsync(
        [FromServices] ITransactionService transactionService,
        [FromServices] ICurrentUser currentUser,
        CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        var transactions = await transactionService
            .GetByUserIdAsync(userId, cancellationToken);
        return Results.Ok(transactions);
    }

    private static async Task<IResult> GetTransactionByIdAsync(
        [FromServices] ITransactionService transactionService,
        [FromServices] ICurrentUser currentUser,
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        var transaction = await transactionService
            .GetByIdAsync(id, userId, cancellationToken);
        
        return transaction is null
            ? Results.NotFound()
            : Results.Ok(transaction);
    }

    private static async Task<IResult> CreateTransactionAsync(
        [FromServices] ITransactionService transactionService,
        [FromServices] ICurrentUser currentUser,
        [FromBody] CreateTransactionRequest request,
        CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        var dto = new CreateTransactionDto(
            request.CategoryId,
            request.Amount,
            request.TransactionDate,
            request.Description);
        var transaction = await transactionService
            .CreateAsync(userId,
            dto,
            cancellationToken);
        return Results.Created(
            $"{TransactionRoutes.Base}/{transaction.Id}",
            transaction);
    }

    private static async Task<IResult> UpdateTransactionAsync(
        [FromServices] ITransactionService transactionService,
        [FromServices] ICurrentUser currentUser,
        [FromRoute] Guid id,
        [FromBody] UpdateTransactionRequest request,
        CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        var dto = new UpdateTransactionDto(
            id,
            request.CategoryId,
            request.Amount,
            request.TransactionDate,
            request.Description);
        var transaction = await transactionService
            .UpdateAsync(userId, dto, cancellationToken);
        return transaction is null
            ? Results.NotFound()
            : Results.Ok(transaction);
    }

    private static async Task<IResult> DeleteTransactionAsync(
        [FromServices] ITransactionService transactionService,
        [FromServices] ICurrentUser currentUser,
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        await transactionService
            .DeleteAsync(id, userId, cancellationToken);
        return Results.NoContent();
    }
}
