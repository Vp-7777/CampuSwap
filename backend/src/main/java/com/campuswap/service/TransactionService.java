package com.campuswap.service;

import com.campuswap.entity.Product;
import com.campuswap.entity.Transaction;
import com.campuswap.entity.User;
import com.campuswap.repository.ProductRepository;
import com.campuswap.repository.TransactionRepository;
import com.campuswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CampusCoinService coinService;

    public Transaction createTransaction(Long productId, Long buyerId, Transaction.TransactionType type) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        if (product.getSeller().getId().equals(buyerId)) {
            throw new RuntimeException("Cannot buy your own product");
        }

        Transaction transaction = new Transaction();
        transaction.setProduct(product);
        transaction.setBuyer(buyer);
        transaction.setSeller(product.getSeller());
        transaction.setAmount(product.getPrice());
        transaction.setType(type);
        transaction.setStatus(Transaction.TransactionStatus.REQUESTED);

        return transactionRepository.save(transaction);
    }

    public Transaction acceptTransaction(Long transactionId, Long sellerId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized");
        }

        transaction.setStatus(Transaction.TransactionStatus.ACCEPTED);
        return transactionRepository.save(transaction);
    }

    public Transaction rejectTransaction(Long transactionId, Long sellerId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized");
        }

        transaction.setStatus(Transaction.TransactionStatus.REJECTED);
        return transactionRepository.save(transaction);
    }

    public Transaction counterTransaction(Long transactionId, Long sellerId, Double newAmount) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (!transaction.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized");
        }
        if (newAmount == null || newAmount <= 0) {
            throw new RuntimeException("Invalid amount");
        }
        transaction.setAmount(newAmount);
        transaction.setStatus(Transaction.TransactionStatus.REQUESTED); // keep in requested with new price
        return transactionRepository.save(transaction);
    }

    public Transaction completeTransaction(Long transactionId, Long sellerId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized");
        }

        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        // Update product status
        Product product = transaction.getProduct();
        product.setStatus(Product.ProductStatus.SOLD);
        productRepository.save(product);

        // Update seller stats
        User seller = transaction.getSeller();
        seller.setTotalSales(seller.getTotalSales() + 1);
        userRepository.save(seller);

        // Reward coins for completed sale and purchase
        try {
            coinService.rewardSaleCompleted(seller, product.getTitle());
            coinService.rewardPurchase(transaction.getBuyer(), product.getTitle());
        } catch (Exception e) {
            System.err.println("Failed to reward coins: " + e.getMessage());
        }

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getBuyerTransactions(Long buyerId) {
        return transactionRepository.findByBuyerId(buyerId);
    }

    public List<Transaction> getSellerTransactions(Long sellerId) {
        return transactionRepository.findBySellerId(sellerId);
    }
    public Transaction createAndCompleteTransaction(Long productId, Long buyerId, Transaction.PaymentMethod method) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        if (product.getSeller().getId().equals(buyerId)) {
            throw new RuntimeException("Cannot buy your own product");
        }
        if (product.getStatus() != Product.ProductStatus.AVAILABLE) {
            throw new RuntimeException("Product is not available");
        }
        Transaction tx = new Transaction();
        tx.setProduct(product);
        tx.setBuyer(buyer);
        tx.setSeller(product.getSeller());
        tx.setAmount(product.getPrice());
        tx.setType(Transaction.TransactionType.BUY);
        tx.setPaymentMethod(method);
        tx.setStatus(Transaction.TransactionStatus.COMPLETED);
        tx.setDeliveryStatus("PLACED");
        tx.setTrackingCode(generateTrackingCode());
        // Update product and rewards
        product.setStatus(Product.ProductStatus.SOLD);
        productRepository.save(product);
        try {
            coinService.rewardSaleCompleted(product.getSeller(), product.getTitle());
            coinService.rewardPurchase(buyer, product.getTitle());
        } catch (Exception e) {
            System.err.println("Failed to reward coins: " + e.getMessage());
        }
        return transactionRepository.save(tx);
    }

    private String generateTrackingCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder("CS-");
        java.util.Random r = new java.util.Random();
        for (int i = 0; i < 8; i++) sb.append(chars.charAt(r.nextInt(chars.length())));
        return sb.toString();
    }
}
