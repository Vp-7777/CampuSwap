package com.campuswap.repository;

import com.campuswap.entity.Cart;
import com.campuswap.entity.Product;
import com.campuswap.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user);
    Optional<Cart> findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
    void deleteByUser(User user);
    long countByUser(User user);
}
