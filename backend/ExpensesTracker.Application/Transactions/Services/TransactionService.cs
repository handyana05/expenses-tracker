using ExpensesTracker.Application.Abstractions.Persistence;
using ExpensesTracker.Application.Common.Exceptions;
using ExpensesTracker.Application.Transactions.DTOs;
using ExpensesTracker.Application.Transactions.Interfaces;
using ExpensesTracker.Application.Transactions.Mappers;
using ExpensesTracker.Domain.Entities;

namespace ExpensesTracker.Application.Transactions.Services;

public sealed class TransactionService(
    ITransactionRepository transactionRepository,
    ICategoryRepository categoryRepository,
    IUnitOfWork unitOfWork) : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository = 
        transactionRepository ?? throw new ArgumentNullException(nameof(transactionRepository));
    private readonly ICategoryRepository _categoryRepository = 
        categoryRepository ?? throw new ArgumentNullException(nameof(categoryRepository));
    private readonly IUnitOfWork _unitOfWork = 
        unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));

    public async Task<TransactionDto> CreateAsync(
        Guid userId, 
        CreateTransactionDto dto, 
        CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository
            .GetByIdAsync(dto.CategoryId, userId, cancellationToken);

        if (category is null)
        {
            throw new NotFoundException("Category not found.");
        }

        var transaction = Transaction.Create(
            userId,
            dto.CategoryId,
            dto.Amount,
            dto.TransactionDate,
            dto.Description);

        await _transactionRepository.AddAsync(transaction, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return transaction.ToDto(category);
    }

    public async Task<bool> DeleteAsync(
        Guid id, 
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        var transaction = await _transactionRepository
            .GetByIdAsync(id, userId, cancellationToken);

        if (transaction is null)
        {
            return false;
        }

        _transactionRepository.Delete(transaction);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<TransactionDto?> GetByIdAsync(
        Guid id, 
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        var transaction = await _transactionRepository
            .GetByIdAsync(id, userId, cancellationToken);
        return transaction?.ToDto();
    }

    public async Task<IReadOnlyList<TransactionDto>> GetByUserIdAsync(
        Guid userId, 
        CancellationToken cancellationToken = default)
    {
        var transactions = await _transactionRepository
            .GetByUserIdAsync(userId, cancellationToken);
        return transactions
            .ToDtos()
            .ToList();
    }

    public async Task<TransactionDto> UpdateAsync(
        Guid userId, 
        UpdateTransactionDto dto, 
        CancellationToken cancellationToken = default)
    {
        var transaction = await _transactionRepository
            .GetByIdAsync(dto.Id, userId, cancellationToken);

        if (transaction is null)
        {
            throw new NotFoundException("Transaction not found.");
        }

        var category = await _categoryRepository
            .GetByIdAsync(dto.CategoryId, userId, cancellationToken);

        if (category is null)
        {
            throw new NotFoundException("Category not found.");
        }

        transaction.Update(
            dto.CategoryId,
            dto.Amount,
            dto.TransactionDate,
            dto.Description);

        _transactionRepository.Update(transaction);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return transaction.ToDto(category);
    }

    public async Task DeleteAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var transaction = await _transactionRepository
            .GetByIdAsync(id, userId, cancellationToken);

        if (transaction is null)
        {
            throw new NotFoundException("Transaction not found.");
        }

        _transactionRepository.Delete(transaction);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
