package com.evision.Bank_Project.dto;

import com.evision.Bank_Project.models.AccountStatus;
import com.evision.Bank_Project.models.AccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AccountResponse(
        Integer id,
        Integer customerId,
        String accountNumber,
        AccountType accountType,
        BigDecimal balance,
        String currency,
        AccountStatus status,
        LocalDateTime createdAt
) {
}
