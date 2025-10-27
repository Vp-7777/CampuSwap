package com.campuswap.controller;

import com.campuswap.entity.Review;
import com.campuswap.entity.User;
import com.campuswap.repository.UserRepository;
import com.campuswap.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Review> createReview(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long productId = Long.valueOf(request.get("productId").toString());
        Integer rating = Integer.valueOf(request.get("rating").toString());
        String comment = request.get("comment").toString();

        Review review = reviewService.createReview(productId, user.getId(), rating, comment);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Review>> getSellerReviews(@PathVariable Long sellerId) {
        return ResponseEntity.ok(reviewService.getSellerReviews(sellerId));
    }
}
