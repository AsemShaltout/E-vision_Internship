package com.evision.Bank_Project.dto;

import com.evision.Bank_Project.models.AccountStatus;
import com.evision.Bank_Project.models.AccountType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record AccountUpdateRequest(
        @NotNull(message = "Account type is required")
        AccountType accountType,

        @NotNull(message = "Currency is required")
        @Pattern(regexp = "[A-Z]{3}", message = "Currency must be a 3-letter uppercase code")
        String currency,

        @NotNull(message = "Status is required")
        AccountStatus status
) {
}
