package com.campuswap.repository;

import com.campuswap.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByApprovalStatus(Product.ApprovalStatus status);
    List<Product> findByCategory(Product.Category category);
    List<Product> findBySellerId(Long sellerId);
    
    @Query("SELECT p FROM Product p WHERE p.approvalStatus = 'APPROVED' AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchProducts(@Param("keyword") String keyword);
    
    @Query("SELECT p FROM Product p WHERE p.approvalStatus = 'APPROVED' AND " +
           "p.category = :category AND p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByCategoryAndPriceRange(@Param("category") Product.Category category,
                                               @Param("minPrice") Double minPrice,
                                               @Param("maxPrice") Double maxPrice);
    
    @Query("SELECT p FROM Product p WHERE p.approvalStatus = 'APPROVED' " +
           "ORDER BY p.viewCount DESC")
    List<Product> findTrendingProducts();
    
    @Query("SELECT AVG(p.price) FROM Product p WHERE p.category = :category " +
           "AND p.approvalStatus = 'APPROVED'")
    Double getAveragePriceByCategory(@Param("category") Product.Category category);

    // Analytics (native queries for Postgres)
    @Query(value = "SELECT category, COALESCE(SUM(view_count),0) AS views FROM products WHERE approval_status='APPROVED' GROUP BY category ORDER BY views DESC", nativeQuery = true)
    List<Object[]> topCategoriesByViews();

    @Query(value = "SELECT date_trunc('week', created_at) AS wk, COUNT(*) FROM products GROUP BY wk ORDER BY wk ASC", nativeQuery = true)
    List<Object[]> weeklyListingCounts();

    @Query(value = "SELECT u.id, u.full_name, COUNT(p.id) AS listings, COALESCE(SUM(p.view_count),0) AS views FROM users u JOIN products p ON p.seller_id=u.id WHERE p.approval_status='APPROVED' GROUP BY u.id,u.full_name ORDER BY views DESC LIMIT 5", nativeQuery = true)
    List<Object[]> topSellers();
}
