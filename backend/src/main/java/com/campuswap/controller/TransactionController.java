package com.campuswap.controller;

import com.campuswap.entity.Transaction;
import com.campuswap.entity.User;
import com.campuswap.repository.UserRepository;
import com.campuswap.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long productId = Long.valueOf(request.get("productId").toString());
        String type = request.get("type").toString();

        Transaction transaction = transactionService.createTransaction(
                productId, 
                user.getId(), 
                Transaction.TransactionType.valueOf(type)
        );

        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/checkout")
    public ResponseEntity<Transaction> checkout(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long productId = Long.valueOf(request.get("productId").toString());
        String pm = String.valueOf(request.get("paymentMethod"));
        Transaction.PaymentMethod method = Transaction.PaymentMethod.valueOf(pm);
        Transaction tx = transactionService.createAndCompleteTransaction(productId, user.getId(), method);
        return ResponseEntity.ok(tx);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Transaction> acceptTransaction(
            @PathVariable Long id,
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(transactionService.acceptTransaction(id, user.getId()));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Transaction> rejectTransaction(
            @PathVariable Long id,
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(transactionService.rejectTransaction(id, user.getId()));
    }

    @PutMapping("/{id}/counter")
    public ResponseEntity<Transaction> counterTransaction(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Double amount = Double.valueOf(String.valueOf(body.get("amount")));
        return ResponseEntity.ok(transactionService.counterTransaction(id, user.getId(), amount));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Transaction> completeTransaction(
            @PathVariable Long id,
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(transactionService.completeTransaction(id, user.getId()));
    }

    @GetMapping("/buyer")
    public ResponseEntity<List<Transaction>> getBuyerTransactions(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(transactionService.getBuyerTransactions(user.getId()));
    }

    @GetMapping("/seller")
    public ResponseEntity<List<Transaction>> getSellerTransactions(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(transactionService.getSellerTransactions(user.getId()));
    }
}
