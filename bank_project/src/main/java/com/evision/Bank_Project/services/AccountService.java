package com.evision.Bank_Project.services;

import com.evision.Bank_Project.dto.AccountCreateRequest;
import com.evision.Bank_Project.dto.AccountResponse;
import com.evision.Bank_Project.dto.AccountUpdateRequest;
import com.evision.Bank_Project.models.Account;
import com.evision.Bank_Project.models.AccountStatus;
import com.evision.Bank_Project.models.Customer;
import com.evision.Bank_Project.repos.AccountRepository;
import com.evision.Bank_Project.repos.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    public AccountService(
            AccountRepository accountRepository,
            CustomerRepository customerRepository
    ) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
    }

    public List<AccountResponse> getAccounts(Integer customerId) {
        List<Account> accounts = customerId == null
                ? accountRepository.findAllByOrderByIdAsc()
                : accountRepository.findByCustomerIdOrderByIdAsc(customerId);

        return accounts.stream().map(this::toResponse).toList();
    }

    public AccountResponse getAccountById(Integer id) {
        return toResponse(findAccountById(id));
    }

    public AccountResponse createAccount(AccountCreateRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Customer not found with id: " + request.customerId()
                ));

        Account account = new Account();
        account.setCustomer(customer);
        account.setAccountNumber(generateAccountNumber());
        account.setAccountType(request.accountType());
        account.setBalance(BigDecimal.ZERO.setScale(2));
        account.setCurrency(request.currency().toUpperCase(Locale.ROOT));
        account.setStatus(AccountStatus.ACTIVE);

        return toResponse(accountRepository.save(account));
    }

    public AccountResponse updateAccount(Integer id, AccountUpdateRequest request) {
        Account account = findAccountById(id);
        account.setAccountType(request.accountType());
        account.setCurrency(request.currency().toUpperCase(Locale.ROOT));
        account.setStatus(request.status());
        return toResponse(accountRepository.save(account));
    }

    public void closeAccount(Integer id) {
        Account account = findAccountById(id);
        account.setStatus(AccountStatus.CLOSED);
        accountRepository.save(account);
    }

    private Account findAccountById(Integer id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Account not found with id: " + id
                ));
    }

    private String generateAccountNumber() {
        return "ACC-" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase(Locale.ROOT);
    }

    private AccountResponse toResponse(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getCustomer().getId(),
                account.getAccountNumber(),
                account.getAccountType(),
                account.getBalance(),
                account.getCurrency(),
                account.getStatus(),
                account.getCreatedAt()
        );
    }
}
