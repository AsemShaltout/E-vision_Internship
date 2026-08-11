package com.evision.Bank_Project.controllers;

import com.evision.Bank_Project.dto.AccountCreateRequest;
import com.evision.Bank_Project.dto.AccountResponse;
import com.evision.Bank_Project.dto.AccountUpdateRequest;
import com.evision.Bank_Project.services.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public List<AccountResponse> getAccounts(
            @RequestParam(required = false) Integer customerId
    ) {
        return accountService.getAccounts(customerId);
    }

    @GetMapping("/{id}")
    public AccountResponse getAccountById(@PathVariable Integer id) {
        return accountService.getAccountById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponse createAccount(
            @Valid @RequestBody AccountCreateRequest request
    ) {
        return accountService.createAccount(request);
    }

    @PutMapping("/{id}")
    public AccountResponse updateAccount(
            @PathVariable Integer id,
            @Valid @RequestBody AccountUpdateRequest request
    ) {
        return accountService.updateAccount(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void closeAccount(@PathVariable Integer id) {
        accountService.closeAccount(id);
    }
}
