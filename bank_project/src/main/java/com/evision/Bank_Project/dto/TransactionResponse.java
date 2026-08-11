package com.evision.Bank_Project.dto;

import com.evision.Bank_Project.models.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Integer id,
        Integer accountId,
        TransactionType type,
        BigDecimal amount,
        BigDecimal balanceAfter,
        String description,
        LocalDateTime timestamp
) {
}
