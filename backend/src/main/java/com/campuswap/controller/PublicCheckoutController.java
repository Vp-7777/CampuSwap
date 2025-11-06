package com.campuswap.controller;

import com.campuswap.entity.User;
import com.campuswap.entity.Transaction;
import com.campuswap.repository.UserRepository;
import com.campuswap.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PublicCheckoutController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/checkout")
    public ResponseEntity<?> publicCheckout(@RequestBody Map<String, Object> body) {
        try {
            String email = String.valueOf(body.get("email"));
            Long productId = Long.valueOf(String.valueOf(body.get("productId")));
            String pm = String.valueOf(body.get("paymentMethod"));
            Transaction.PaymentMethod method = Transaction.PaymentMethod.valueOf(pm);

            // Find or create buyer
            User buyer = userRepository.findByEmail(email).orElseGet(() -> {
                User u = new User();
                u.setEmail(email);
                u.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                u.setFullName(email.split("@")[0]);
                u.setRole(User.Role.STUDENT);
                u.setEmailVerified(true);
                return userRepository.save(u);
            });

            Transaction tx = transactionService.createAndCompleteTransaction(productId, buyer.getId(), method);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "transactionId", tx.getId(),
                    "trackingCode", tx.getTrackingCode(),
                    "status", tx.getStatus().name()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/request")
    public ResponseEntity<?> publicRequest(@RequestBody Map<String, Object> body) {
        try {
            String email = String.valueOf(body.get("email"));
            Long productId = Long.valueOf(String.valueOf(body.get("productId")));

            // Find or create buyer
            User buyer = userRepository.findByEmail(email).orElseGet(() -> {
                User u = new User();
                u.setEmail(email);
                u.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                u.setFullName(email.split("@")[0]);
                u.setRole(User.Role.STUDENT);
                u.setEmailVerified(true);
                return userRepository.save(u);
            });

            Transaction tx = transactionService.createTransaction(productId, buyer.getId(), Transaction.TransactionType.BUY);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "transactionId", tx.getId(),
                    "status", tx.getStatus().name(),
                    "amount", tx.getAmount()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}
