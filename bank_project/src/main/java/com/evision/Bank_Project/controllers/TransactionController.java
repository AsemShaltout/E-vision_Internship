package com.evision.Bank_Project.controllers;

import com.evision.Bank_Project.dto.TransactionRequest;
import com.evision.Bank_Project.dto.TransactionResponse;
import com.evision.Bank_Project.services.TransactionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/accounts/{accountId}")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public TransactionResponse deposit(
            @PathVariable Integer accountId,
            @Valid @RequestBody TransactionRequest request
    ) {
        return transactionService.deposit(accountId, request);
    }

    @PostMapping("/withdraw")
    public TransactionResponse withdraw(
            @PathVariable Integer accountId,
            @Valid @RequestBody TransactionRequest request
    ) {
        return transactionService.withdraw(accountId, request);
    }

    @GetMapping("/transactions")
    public List<TransactionResponse> getTransactionHistory(
            @PathVariable Integer accountId
    ) {
        return transactionService.getTransactionHistory(accountId);
    }
}
