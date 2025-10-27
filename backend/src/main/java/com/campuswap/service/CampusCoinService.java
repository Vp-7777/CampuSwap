package com.campuswap.service;

import com.campuswap.entity.CoinTransaction;
import com.campuswap.entity.User;
import com.campuswap.repository.CoinTransactionRepository;
import com.campuswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CampusCoinService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CoinTransactionRepository coinTransactionRepository;
    
    // Coin rewards configuration
    private static final int COINS_PRODUCT_UPLOAD = 10;
    private static final int COINS_SALE_COMPLETED = 50;
    private static final int COINS_PURCHASE = 20;
    private static final int COINS_REFERRAL = 100;
    private static final int COINS_BOOST_PRODUCT = 50;
    private static final int COINS_UNLOCK_BADGE = 100;
    
    /**
     * Add coins to user's account
     */
    @Transactional
    public CoinTransaction addCoins(User user, Integer amount, CoinTransaction.TransactionType type, String description) {
        user.setCampusCoins(user.getCampusCoins() + amount);
        userRepository.save(user);
        
        CoinTransaction transaction = new CoinTransaction(user, amount, type, description, user.getCampusCoins());
        return coinTransactionRepository.save(transaction);
    }
    
    /**
     * Deduct coins from user's account
     */
    @Transactional
    public CoinTransaction deductCoins(User user, Integer amount, CoinTransaction.TransactionType type, String description) throws Exception {
        if (user.getCampusCoins() < amount) {
            throw new Exception("Insufficient CampusCoins. You have " + user.getCampusCoins() + " coins, but need " + amount + " coins.");
        }
        
        user.setCampusCoins(user.getCampusCoins() - amount);
        userRepository.save(user);
        
        CoinTransaction transaction = new CoinTransaction(user, -amount, type, description, user.getCampusCoins());
        return coinTransactionRepository.save(transaction);
    }
    
    /**
     * Reward coins for product upload
     */
    @Transactional
    public CoinTransaction rewardProductUpload(User user, String productName) {
        return addCoins(user, COINS_PRODUCT_UPLOAD, 
                       CoinTransaction.TransactionType.EARN_PRODUCT_UPLOAD, 
                       "Uploaded product: " + productName);
    }
    
    /**
     * Reward coins for completed sale
     */
    @Transactional
    public CoinTransaction rewardSaleCompleted(User seller, String productName) {
        return addCoins(seller, COINS_SALE_COMPLETED, 
                       CoinTransaction.TransactionType.EARN_SALE_COMPLETED, 
                       "Sold product: " + productName);
    }
    
    /**
     * Reward coins for purchase
     */
    @Transactional
    public CoinTransaction rewardPurchase(User buyer, String productName) {
        return addCoins(buyer, COINS_PURCHASE, 
                       CoinTransaction.TransactionType.EARN_PURCHASE, 
                       "Purchased product: " + productName);
    }
    
    /**
     * Reward coins for referral
     */
    @Transactional
    public CoinTransaction rewardReferral(User referrer, String referredUserEmail) {
        referrer.setTotalReferrals(referrer.getTotalReferrals() + 1);
        userRepository.save(referrer);
        
        return addCoins(referrer, COINS_REFERRAL, 
                       CoinTransaction.TransactionType.EARN_REFERRAL, 
                       "Referred user: " + referredUserEmail);
    }
    
    /**
     * Spend coins to boost product
     */
    @Transactional
    public CoinTransaction boostProduct(User user, String productName) throws Exception {
        return deductCoins(user, COINS_BOOST_PRODUCT, 
                          CoinTransaction.TransactionType.SPEND_BOOST_PRODUCT, 
                          "Boosted product: " + productName);
    }
    
    /**
     * Spend coins to unlock badge
     */
    @Transactional
    public CoinTransaction unlockBadge(User user, String badgeName) throws Exception {
        CoinTransaction transaction = deductCoins(user, COINS_UNLOCK_BADGE, 
                                                   CoinTransaction.TransactionType.SPEND_UNLOCK_BADGE, 
                                                   "Unlocked badge: " + badgeName);
        
        // Add badge to user
        user.getBadges().add(badgeName);
        userRepository.save(user);
        
        return transaction;
    }
    
    /**
     * Apply discount using coins (1 coin = ₹1 discount)
     */
    @Transactional
    public CoinTransaction applyDiscount(User user, Integer coinsToUse, String productName) throws Exception {
        return deductCoins(user, coinsToUse, 
                          CoinTransaction.TransactionType.SPEND_DISCOUNT, 
                          "Discount on: " + productName);
    }
    
    /**
     * Generate referral code for user
     */
    @Transactional
    public String generateReferralCode(User user) {
        if (user.getReferralCode() == null || user.getReferralCode().isEmpty()) {
            String code = "CAMPUS" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            user.setReferralCode(code);
            userRepository.save(user);
        }
        return user.getReferralCode();
    }
    
    /**
     * Get user's coin transaction history
     */
    public List<CoinTransaction> getCoinHistory(User user) {
        return coinTransactionRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    /**
     * Get recent coin transactions (last 10)
     */
    public List<CoinTransaction> getRecentTransactions(User user) {
        return coinTransactionRepository.findTop10ByUserOrderByCreatedAtDesc(user);
    }
    
    /**
     * Check if user can afford something
     */
    public boolean canAfford(User user, Integer amount) {
        return user.getCampusCoins() >= amount;
    }
    
    /**
     * Get coin prices
     */
    public static class CoinPrices {
        public static final int BOOST_PRODUCT = COINS_BOOST_PRODUCT;
        public static final int UNLOCK_BADGE = COINS_UNLOCK_BADGE;
    }
}
