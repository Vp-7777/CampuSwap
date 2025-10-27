package com.campuswap.controller;

import com.campuswap.entity.CoinTransaction;
import com.campuswap.entity.Product;
import com.campuswap.entity.User;
import com.campuswap.repository.ProductRepository;
import com.campuswap.repository.UserRepository;
import com.campuswap.service.CampusCoinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coins")
@CrossOrigin(origins = "http://localhost:3000")
public class CampusCoinController {
    
    @Autowired
    private CampusCoinService coinService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    /**
     * Get current user's coin balance
     */
    @GetMapping("/balance")
    public ResponseEntity<?> getCoinBalance(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("campusCoins", user.getCampusCoins());
            response.put("totalReferrals", user.getTotalReferrals());
            response.put("referralCode", user.getReferralCode());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get user's coin transaction history
     */
    @GetMapping("/history")
    public ResponseEntity<?> getCoinHistory(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<CoinTransaction> history = coinService.getCoinHistory(user);
            
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get recent coin transactions (last 10)
     */
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentTransactions(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<CoinTransaction> recent = coinService.getRecentTransactions(user);
            
            return ResponseEntity.ok(recent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Generate referral code
     */
    @PostMapping("/referral/generate")
    public ResponseEntity<?> generateReferralCode(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String code = coinService.generateReferralCode(user);
            
            return ResponseEntity.ok(Map.of("referralCode", code));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Boost a product listing (costs 50 coins)
     */
    @PostMapping("/boost/{productId}")
    public ResponseEntity<?> boostProduct(@PathVariable Long productId, 
                                         @RequestBody Map<String, String> request,
                                         Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            // Check if user owns the product
            if (!product.getSeller().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "You can only boost your own products"));
            }
            
            CoinTransaction transaction = coinService.boostProduct(user, product.getTitle());
            
            // Mark product as boosted for 7 days
            product.setBoosted(true);
            product.setBoostedUntil(java.time.LocalDateTime.now().plusDays(7));
            productRepository.save(product);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product boosted successfully for 7 days!");
            response.put("coinsRemaining", user.getCampusCoins());
            response.put("boostedUntil", product.getBoostedUntil());
            response.put("transaction", transaction);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Unlock a badge (costs 100 coins)
     */
    @PostMapping("/badge/unlock")
    public ResponseEntity<?> unlockBadge(@RequestBody Map<String, String> request,
                                        Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String badgeName = request.get("badgeName");
            
            // Check if user already has the badge
            if (user.getBadges().contains(badgeName)) {
                return ResponseEntity.badRequest().body(Map.of("error", "You already have this badge"));
            }
            
            CoinTransaction transaction = coinService.unlockBadge(user, badgeName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Badge unlocked successfully!");
            response.put("badgeName", badgeName);
            response.put("coinsRemaining", user.getCampusCoins());
            response.put("transaction", transaction);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get available badges to unlock
     */
    @GetMapping("/badges/available")
    public ResponseEntity<?> getAvailableBadges(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Define available badges
            Map<String, Object> badges = new HashMap<>();
            badges.put("🏆 Top Seller", Map.of("cost", 100, "unlocked", user.getBadges().contains("🏆 Top Seller")));
            badges.put("⭐ Verified", Map.of("cost", 100, "unlocked", user.getBadges().contains("⭐ Verified")));
            badges.put("🎓 Scholar", Map.of("cost", 100, "unlocked", user.getBadges().contains("🎓 Scholar")));
            badges.put("💎 Premium", Map.of("cost", 100, "unlocked", user.getBadges().contains("💎 Premium")));
            badges.put("🚀 Early Adopter", Map.of("cost", 100, "unlocked", user.getBadges().contains("🚀 Early Adopter")));
            badges.put("🌟 Trusted", Map.of("cost", 100, "unlocked", user.getBadges().contains("🌟 Trusted")));
            
            return ResponseEntity.ok(badges);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get coin prices and info
     */
    @GetMapping("/prices")
    public ResponseEntity<?> getCoinPrices() {
        Map<String, Object> prices = new HashMap<>();
        prices.put("boostProduct", CampusCoinService.CoinPrices.BOOST_PRODUCT);
        prices.put("unlockBadge", CampusCoinService.CoinPrices.UNLOCK_BADGE);
        prices.put("discountRate", "1 coin = ₹1 discount");
        
        Map<String, Integer> earnings = new HashMap<>();
        earnings.put("productUpload", 10);
        earnings.put("saleCompleted", 50);
        earnings.put("purchase", 20);
        earnings.put("referral", 100);
        
        prices.put("earnings", earnings);
        
        return ResponseEntity.ok(prices);
    }
}
