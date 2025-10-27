package com.campuswap.repository;

import com.campuswap.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByVerificationToken(String token);

    // Analytics
    @org.springframework.data.jpa.repository.Query(value = "SELECT date_trunc('week', created_at) AS wk, COUNT(*) FROM users GROUP BY wk ORDER BY wk ASC", nativeQuery = true)
    java.util.List<Object[]> weeklyUserCounts();
}
