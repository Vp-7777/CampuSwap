package com.campuswap.controller;

import com.campuswap.entity.Cart;
import com.campuswap.entity.User;
import com.campuswap.repository.UserRepository;
import com.campuswap.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Add product to cart
     */
    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addToCart(@PathVariable Long productId, 
                                       Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Cart cart = cartService.addToCart(user, productId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product added to cart");
            response.put("cartCount", cartService.getCartCount(user));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get cart items
     */
    @GetMapping
    public ResponseEntity<?> getCartItems(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Cart> items = cartService.getCartItems(user);
            double total = cartService.calculateTotal(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("items", items);
            response.put("total", total);
            response.put("count", items.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Remove product from cart
     */
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId,
                                           Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            cartService.removeFromCart(user, productId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product removed from cart");
            response.put("cartCount", cartService.getCartCount(user));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Clear cart
     */
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            cartService.clearCart(user);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Cart cleared"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get cart count
     */
    @GetMapping("/count")
    public ResponseEntity<?> getCartCount(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            long count = cartService.getCartCount(user);
            
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Calculate total with discount
     */
    @PostMapping("/calculate-discount")
    public ResponseEntity<?> calculateDiscount(@RequestBody Map<String, Integer> request,
                                               Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            int coinsToUse = request.get("coinsToUse");
            
            double total = cartService.calculateTotal(user);
            double discountedTotal = cartService.calculateTotalWithDiscount(user, coinsToUse);
            double discount = total - discountedTotal;
            
            Map<String, Object> response = new HashMap<>();
            response.put("originalTotal", total);
            response.put("discount", discount);
            response.put("finalTotal", discountedTotal);
            response.put("coinsUsed", (int)discount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
