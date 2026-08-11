package com.evision.Bank_Project.repos;

import com.evision.Bank_Project.models.BankTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<BankTransaction, Integer> {

    List<BankTransaction> findByAccountIdOrderByTimestampAsc(Integer accountId);
}
