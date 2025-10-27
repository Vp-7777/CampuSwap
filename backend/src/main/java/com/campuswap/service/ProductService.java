package com.campuswap.service;

import com.campuswap.dto.ProductRequest;
import com.campuswap.entity.Product;
import com.campuswap.entity.User;
import com.campuswap.repository.ProductRepository;
import com.campuswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CampusCoinService coinService;

    private final String UPLOAD_DIR = "./uploads/products/";

    public Product createProduct(ProductRequest request, Long userId, MultipartFile image) {
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = new Product();
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setSeller(seller);
        product.setExchangeAllowed(request.isExchangeAllowed());
        product.setExchangeItem(request.getExchangeItem());
        product.setApprovalStatus(Product.ApprovalStatus.PENDING);
        product.setStatus(Product.ProductStatus.AVAILABLE);

        // AI Price Suggestion
        Double suggestedPrice = calculateSuggestedPrice(request.getCategory());
        product.setSuggestedPrice(suggestedPrice);

        // Handle image upload
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            product.getImages().add(imagePath);
        }

        Product savedProduct = productRepository.save(product);
        
        // Reward coins for product upload
        try {
            coinService.rewardProductUpload(seller, request.getTitle());
        } catch (Exception e) {
            // Log but don't fail the product creation
            System.err.println("Failed to reward coins: " + e.getMessage());
        }
        
        return savedProduct;
    }

    @Transactional(readOnly = true)
    public List<Product> getAllApprovedProducts() {
        List<Product> products = productRepository.findByApprovalStatus(Product.ApprovalStatus.APPROVED);
        // Initialize lazy associations needed by JSON serialization
        products.forEach(p -> {
            if (p.getSeller() != null) {
                p.getSeller().getEmail();
            }
            // Force initialize images collection to avoid LazyInitializationException
            if (p.getImages() != null) {
                p.getImages().size();
            }
        });
        return products;
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword);
    }

    @Transactional
    public Product getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Initialize lazy associations needed by JSON serialization
        if (product.getSeller() != null) {
            product.getSeller().getEmail();
        }
        if (product.getImages() != null) {
            product.getImages().size();
        }
        
        // Increment view count
        product.setViewCount(product.getViewCount() + 1);
        return productRepository.save(product);
    }

    public List<Product> getTrendingProducts() {
        return productRepository.findTrendingProducts();
    }

    public List<Product> getProductsByCategory(Product.Category category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getUserProducts(Long userId) {
        List<Product> products = productRepository.findBySellerId(userId);
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

    public void deleteProduct(Long productId, Long userId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this product");
        }

        productRepository.delete(product);
    }

    // AI Price Suggestion Algorithm
    private Double calculateSuggestedPrice(Product.Category category) {
        Double avgPrice = productRepository.getAveragePriceByCategory(category);
        return avgPrice != null ? avgPrice : 50.0; // Default suggestion
    }

    private String saveImage(MultipartFile file) {
        try {
            // Create upload directory if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.write(filePath, file.getBytes());

            return "/uploads/products/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }
}
