package com.campuswap.repository;

import com.campuswap.entity.CoinTransaction;
import com.campuswap.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoinTransactionRepository extends JpaRepository<CoinTransaction, Long> {
    List<CoinTransaction> findByUserOrderByCreatedAtDesc(User user);
    List<CoinTransaction> findTop10ByUserOrderByCreatedAtDesc(User user);
}
