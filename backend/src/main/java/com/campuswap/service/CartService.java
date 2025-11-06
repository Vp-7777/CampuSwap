package com.campuswap.service;

import com.campuswap.entity.Cart;
import com.campuswap.entity.Product;
import com.campuswap.entity.User;
import com.campuswap.repository.CartRepository;
import com.campuswap.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    /**
     * Add product to cart
     */
    @Transactional
    public Cart addToCart(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Check if user owns the product
        if (product.getSeller().getId().equals(user.getId())) {
            throw new RuntimeException("Cannot add your own product to cart");
        }
        
        // Check if product is available
        if (product.getStatus() != Product.ProductStatus.AVAILABLE) {
            throw new RuntimeException("Product is not available");
        }
        
        // Check if already in cart
        if (cartRepository.findByUserAndProduct(user, product).isPresent()) {
            throw new RuntimeException("Product already in cart");
        }
        
        Cart cart = new Cart(user, product);
        return cartRepository.save(cart);
    }
    
    /**
     * Get user's cart items
     */
    @Transactional(readOnly = true)
    public List<Cart> getCartItems(User user) {
        List<Cart> items = cartRepository.findByUser(user);
        // Force initialization of lazy-loaded products and sellers
        items.forEach(cart -> {
            cart.getProduct().getTitle();
            // ensure seller and images are initialized for JSON
            if (cart.getProduct().getSeller() != null) {
                cart.getProduct().getSeller().getEmail();
            }
            if (cart.getProduct().getImages() != null) {
                cart.getProduct().getImages().size();
            }
        });
        return items;
    }
    
    /**
     * Remove item from cart
     */
    @Transactional
    public void removeFromCart(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        cartRepository.deleteByUserAndProduct(user, product);
    }
    
    /**
     * Clear entire cart
     */
    @Transactional
    public void clearCart(User user) {
        cartRepository.deleteByUser(user);
    }
    
    /**
     * Get cart item count
     */
    public long getCartCount(User user) {
        return cartRepository.countByUser(user);
    }
    
    /**
     * Calculate cart total
     */
    public double calculateTotal(User user) {
        List<Cart> items = cartRepository.findByUser(user);
        return items.stream()
                .mapToDouble(cart -> cart.getProduct().getPrice())
                .sum();
    }
    
    /**
     * Calculate total with coin discount
     */
    public double calculateTotalWithDiscount(User user, int coinsToUse) {
        double total = calculateTotal(user);
        double discount = Math.min(coinsToUse, total); // 1 coin = ₹1
        return Math.max(0, total - discount);
    }
}
