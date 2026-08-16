package com.evision.Bank_Project;

import com.evision.Bank_Project.dto.AccountCreateRequest;
import com.evision.Bank_Project.dto.AccountResponse;
import com.evision.Bank_Project.dto.CustomerRequest;
import com.evision.Bank_Project.dto.CustomerResponse;
import com.evision.Bank_Project.dto.TransactionRequest;
import com.evision.Bank_Project.dto.TransactionResponse;
import com.evision.Bank_Project.models.AccountStatus;
import com.evision.Bank_Project.models.AccountType;
import com.evision.Bank_Project.models.TransactionType;
import com.evision.Bank_Project.services.AccountService;
import com.evision.Bank_Project.services.CustomerService;
import com.evision.Bank_Project.services.TransactionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class BankProjectApplicationTests {

	@Autowired
	private CustomerService customerService;

	@Autowired
	private AccountService accountService;

	@Autowired
	private TransactionService transactionService;

	@Test
	void contextLoads() {
	}

	@Test
	@Transactional
	void completesAccountAndTransactionFlow() {
		String uniqueValue = UUID.randomUUID().toString();
		CustomerResponse customer = customerService.createCustomer(new CustomerRequest(
				"Integration",
				"Test",
				uniqueValue + "@example.com",
				"01000000000",
				"Cairo",
				LocalDate.of(2000, 1, 1),
				uniqueValue
		));

		AccountResponse account = accountService.createAccount(new AccountCreateRequest(
				customer.id(),
				AccountType.SAVINGS,
				"EGP"
		));

		TransactionResponse deposit = transactionService.deposit(
				account.id(),
				new TransactionRequest(new BigDecimal("1000.00"), "Initial deposit")
		);
		TransactionResponse withdrawal = transactionService.withdraw(
				account.id(),
				new TransactionRequest(new BigDecimal("250.00"), "ATM withdrawal")
		);

		assertEquals(TransactionType.DEPOSIT, deposit.type());
		assertEquals(new BigDecimal("1000.00"), deposit.balanceAfter());
		assertEquals(TransactionType.WITHDRAWAL, withdrawal.type());
		assertEquals(new BigDecimal("750.00"), withdrawal.balanceAfter());
		assertEquals(2, transactionService.getTransactionHistory(account.id()).size());

		accountService.closeAccount(account.id());
		assertEquals(AccountStatus.CLOSED, accountService.getAccountById(account.id()).status());
	}

}
