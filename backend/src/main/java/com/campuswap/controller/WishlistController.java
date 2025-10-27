package com.campuswap.controller;

import com.campuswap.entity.Product;
import com.campuswap.entity.User;
import com.campuswap.entity.Wishlist;
import com.campuswap.repository.UserRepository;
import com.campuswap.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{productId}")
    public ResponseEntity<Wishlist> addToWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Wishlist wishlist = wishlistService.addToWishlist(user.getId(), productId);
        return ResponseEntity.ok(wishlist);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        wishlistService.removeFromWishlist(user.getId(), productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Product>> getUserWishlist(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(wishlistService.getUserWishlist(user.getId()));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Boolean> checkWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(wishlistService.isInWishlist(user.getId(), productId));
    }
}
