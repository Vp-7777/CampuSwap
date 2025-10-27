package com.campuswap.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "coin_transactions")
public class CoinTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private Integer amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private Integer balanceAfter;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum TransactionType {
        EARN_PRODUCT_UPLOAD,    // +10 coins
        EARN_SALE_COMPLETED,    // +50 coins
        EARN_PURCHASE,          // +20 coins
        EARN_REFERRAL,          // +100 coins
        SPEND_BOOST_PRODUCT,    // -50 coins
        SPEND_UNLOCK_BADGE,     // -100 coins
        SPEND_DISCOUNT,         // Variable
        ADMIN_ADJUSTMENT        // Admin add/remove
    }
    
    // Constructors
    public CoinTransaction() {
    }
    
    public CoinTransaction(User user, Integer amount, TransactionType type, String description, Integer balanceAfter) {
        this.user = user;
        this.amount = amount;
        this.type = type;
        this.description = description;
        this.balanceAfter = balanceAfter;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Integer getAmount() {
        return amount;
    }
    
    public void setAmount(Integer amount) {
        this.amount = amount;
    }
    
    public TransactionType getType() {
        return type;
    }
    
    public void setType(TransactionType type) {
        this.type = type;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getBalanceAfter() {
        return balanceAfter;
    }
    
    public void setBalanceAfter(Integer balanceAfter) {
        this.balanceAfter = balanceAfter;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
