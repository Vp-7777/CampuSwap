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
}
