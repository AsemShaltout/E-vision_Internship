package com.evision.Bank_Project.repos;

import com.evision.Bank_Project.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}
