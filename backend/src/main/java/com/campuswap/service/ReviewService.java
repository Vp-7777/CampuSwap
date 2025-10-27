package com.campuswap.service;

import com.campuswap.entity.Product;
import com.campuswap.entity.Review;
import com.campuswap.entity.User;
import com.campuswap.repository.ProductRepository;
import com.campuswap.repository.ReviewRepository;
import com.campuswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Review createReview(Long productId, Long reviewerId, Integer rating, String comment) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review();
        review.setProduct(product);
        review.setReviewer(reviewer);
        review.setSeller(product.getSeller());
        review.setRating(rating);
        review.setComment(comment);

        Review savedReview = reviewRepository.save(review);

        // Update average ratings
        updateProductRating(productId);
        updateSellerRating(product.getSeller().getId());

        return savedReview;
    }

    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public List<Review> getSellerReviews(Long sellerId) {
        return reviewRepository.findBySellerId(sellerId);
    }

    private void updateProductRating(Long productId) {
        Double avgRating = reviewRepository.getAverageRatingByProduct(productId);
        Product product = productRepository.findById(productId).orElse(null);
        if (product != null && avgRating != null) {
            product.setAverageRating(avgRating);
            productRepository.save(product);
        }
    }

    private void updateSellerRating(Long sellerId) {
        Double avgRating = reviewRepository.getAverageRatingBySeller(sellerId);
        User seller = userRepository.findById(sellerId).orElse(null);
        if (seller != null && avgRating != null) {
            seller.setAverageRating(avgRating);
            
            // Award badges based on rating
            if (avgRating >= 4.5) {
                seller.getBadges().add("TOP_SELLER");
            }
            if (seller.getTotalSales() >= 10) {
                seller.getBadges().add("EXPERIENCED_SELLER");
            }
            
            userRepository.save(seller);
        }
    }
}
