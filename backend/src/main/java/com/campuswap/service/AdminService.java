package com.campuswap.service;

import com.campuswap.entity.Product;
import com.campuswap.repository.ProductRepository;
import com.campuswap.repository.TransactionRepository;
import com.campuswap.repository.UserRepository;
import com.campuswap.dto.AdminUserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

@Service
public class AdminService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Product> getPendingProducts() {
        return productRepository.findByApprovalStatus(Product.ApprovalStatus.PENDING);
    }

    public Product approveProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setApprovalStatus(Product.ApprovalStatus.APPROVED);
        return productRepository.save(product);
    }

    public Product rejectProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setApprovalStatus(Product.ApprovalStatus.REJECTED);
        return productRepository.save(product);
    }

    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        analytics.put("totalUsers", userRepository.count());
        analytics.put("totalProducts", productRepository.count());
        analytics.put("pendingApprovals", productRepository.findByApprovalStatus(Product.ApprovalStatus.PENDING).size());
        analytics.put("approvedProducts", productRepository.findByApprovalStatus(Product.ApprovalStatus.APPROVED).size());
        analytics.put("totalTransactions", transactionRepository.count());
        
        return analytics;
    }

    public List<AdminUserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(AdminUserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getStats() {
        Map<String, Object> res = new HashMap<>();

        // Approval ratio
        int approved = productRepository.findByApprovalStatus(Product.ApprovalStatus.APPROVED).size();
        int pending = productRepository.findByApprovalStatus(Product.ApprovalStatus.PENDING).size();
        int rejected = productRepository.findByApprovalStatus(Product.ApprovalStatus.REJECTED).size();
        res.put("approvalRatio", Map.of("approved", approved, "pending", pending, "rejected", rejected));

        // Top categories by views
        List<Map<String,Object>> topCategories = productRepository.topCategoriesByViews().stream()
                .map(r -> Map.<String,Object>of(
                        "category", String.valueOf(r[0]),
                        "views", ((Number) r[1]).longValue()
                ))
                .collect(Collectors.toList());
        res.put("topCategories", topCategories);

        // Top sellers
        List<Map<String,Object>> topSellers = productRepository.topSellers().stream()
                .map(r -> Map.<String,Object>of(
                        "userId", ((Number) r[0]).longValue(),
                        "fullName", String.valueOf(r[1]),
                        "listings", ((Number) r[2]).longValue(),
                        "views", ((Number) r[3]).longValue()
                ))
                .collect(Collectors.toList());
        res.put("topSellers", topSellers);

        // Weekly listings
        List<Map<String,Object>> weeklyListings = productRepository.weeklyListingCounts().stream()
                .map(r -> Map.<String,Object>of(
                        "week", String.valueOf(r[0]),
                        "count", ((Number) r[1]).longValue()
                ))
                .collect(Collectors.toList());
        res.put("weeklyListings", weeklyListings);

        // User growth
        List<Map<String,Object>> userGrowth = userRepository.weeklyUserCounts().stream()
                .map(r -> Map.<String,Object>of(
                        "week", String.valueOf(r[0]),
                        "count", ((Number) r[1]).longValue()
                ))
                .collect(Collectors.toList());
        res.put("userGrowth", userGrowth);

        return res;
    }
}
