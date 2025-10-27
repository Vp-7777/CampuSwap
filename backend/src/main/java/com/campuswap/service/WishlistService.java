package com.campuswap.service;

import com.campuswap.entity.Product;
import com.campuswap.entity.User;
import com.campuswap.entity.Wishlist;
import com.campuswap.repository.ProductRepository;
import com.campuswap.repository.UserRepository;
import com.campuswap.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Wishlist addToWishlist(Long userId, Long productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("Product already in wishlist");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);

        return wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Transactional
    public List<Product> getUserWishlist(Long userId) {
        List<Wishlist> wishlistItems = wishlistRepository.findByUserId(userId);
        List<Product> products = wishlistItems.stream()
                .map(Wishlist::getProduct)
                .collect(Collectors.toList());
        // Initialize lazy fields for serialization
        products.forEach(p -> {
            if (p.getSeller() != null) {
                p.getSeller().getEmail();
            }
            if (p.getImages() != null) {
                p.getImages().size();
            }
        });
        return products;
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }
}
