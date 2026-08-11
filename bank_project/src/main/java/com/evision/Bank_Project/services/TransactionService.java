package com.evision.Bank_Project.services;

import com.evision.Bank_Project.dto.TransactionRequest;
import com.evision.Bank_Project.dto.TransactionResponse;
import com.evision.Bank_Project.models.Account;
import com.evision.Bank_Project.models.AccountStatus;
import com.evision.Bank_Project.models.BankTransaction;
import com.evision.Bank_Project.models.TransactionType;
import com.evision.Bank_Project.repos.AccountRepository;
import com.evision.Bank_Project.repos.TransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository
    ) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public TransactionResponse deposit(Integer accountId, TransactionRequest request) {
        Account account = findActiveAccountForUpdate(accountId);
        BigDecimal amount = normalizeAmount(request.amount());
        BigDecimal newBalance = account.getBalance().add(amount);
        account.setBalance(newBalance);
        accountRepository.save(account);
        return saveTransaction(account, TransactionType.DEPOSIT, amount, request.description());
    }

    @Transactional
    public TransactionResponse withdraw(Integer accountId, TransactionRequest request) {
        Account account = findActiveAccountForUpdate(accountId);
        BigDecimal amount = normalizeAmount(request.amount());

        if (account.getBalance().compareTo(amount) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Insufficient balance"
            );
        }

        BigDecimal newBalance = account.getBalance().subtract(amount);
        account.setBalance(newBalance);
        accountRepository.save(account);
        return saveTransaction(account, TransactionType.WITHDRAWAL, amount, request.description());
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionHistory(Integer accountId) {
        if (!accountRepository.existsById(accountId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Account not found with id: " + accountId
            );
        }

        return transactionRepository.findByAccountIdOrderByTimestampAsc(accountId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private Account findActiveAccountForUpdate(Integer accountId) {
        Account account = accountRepository.findByIdForUpdate(accountId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Account not found with id: " + accountId
                ));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Transactions are only allowed on active accounts"
            );
        }

        return account;
    }

    private BigDecimal normalizeAmount(BigDecimal amount) {
        return amount.setScale(2, RoundingMode.UNNECESSARY);
    }

    private TransactionResponse saveTransaction(
            Account account,
            TransactionType type,
            BigDecimal amount,
            String description
    ) {
        BankTransaction transaction = new BankTransaction();
        transaction.setAccount(account);
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setBalanceAfter(account.getBalance());
        transaction.setDescription(description);
        return toResponse(transactionRepository.save(transaction));
    }

    private TransactionResponse toResponse(BankTransaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAccount().getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getBalanceAfter(),
                transaction.getDescription(),
                transaction.getTimestamp()
        );
    }
}
