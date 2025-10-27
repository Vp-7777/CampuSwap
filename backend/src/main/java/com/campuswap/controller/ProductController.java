package com.campuswap.controller;

import com.campuswap.dto.ProductRequest;
import com.campuswap.entity.Product;
import com.campuswap.entity.User;
import com.campuswap.repository.UserRepository;
import com.campuswap.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @Valid @ModelAttribute ProductRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productService.createProduct(request, user.getId(), image);
        return ResponseEntity.ok(product);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllApprovedProducts());
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<Product>> getTrendingProducts() {
        return ResponseEntity.ok(productService.getTrendingProducts());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Product.Category category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping("/my-products")
    public ResponseEntity<List<Product>> getMyProducts(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(productService.getUserProducts(user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        productService.deleteProduct(id, user.getId());
        return ResponseEntity.ok().build();
    }
}
