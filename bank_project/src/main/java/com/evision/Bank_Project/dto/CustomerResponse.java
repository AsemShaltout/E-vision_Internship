package com.evision.Bank_Project.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CustomerResponse(
        Integer id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String address,
        LocalDate dob,
        String nationalId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
