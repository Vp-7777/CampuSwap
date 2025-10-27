package com.campuswap.repository;

import com.campuswap.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBuyerId(Long buyerId);
    List<Transaction> findBySellerId(Long sellerId);
    List<Transaction> findByProductId(Long productId);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.seller.id = :sellerId AND t.status = 'COMPLETED'")
    Integer countCompletedSalesBySeller(Long sellerId);
}
