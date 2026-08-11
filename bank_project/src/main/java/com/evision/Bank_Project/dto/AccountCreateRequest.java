package com.evision.Bank_Project.dto;

import com.evision.Bank_Project.models.AccountType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record AccountCreateRequest(
        @NotNull(message = "Customer ID is required")
        @Positive(message = "Customer ID must be positive")
        Integer customerId,

        @NotNull(message = "Account type is required")
        AccountType accountType,

        @NotNull(message = "Currency is required")
        @Pattern(regexp = "[A-Z]{3}", message = "Currency must be a 3-letter uppercase code")
        String currency
) {
}
