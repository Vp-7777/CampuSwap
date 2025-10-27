package com.campuswap.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String fullName;
    
    private String phoneNumber;
    
    private String profileImage;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.STUDENT;
    
    private boolean emailVerified = false;
    
    private String verificationToken;
    
    private Double walletBalance = 0.0;
    
    @Column
    private Integer campusCoins = 0;
    
    private String referralCode;
    
    @Column
    private Integer totalReferrals = 0;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_badges", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "badge")
    private Set<String> badges = new HashSet<>();
    
    private Integer totalSales = 0;
    
    private Double averageRating = 0.0;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum Role {
        ADMIN, STUDENT
    }
    
    // Constructors
    public User() {
    }
    
    public User(Long id, String email, String password, String fullName, String phoneNumber, 
                String profileImage, Role role, boolean emailVerified, String verificationToken, 
                Double walletBalance, Set<String> badges, Integer totalSales, Double averageRating,
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.profileImage = profileImage;
        this.role = role;
        this.emailVerified = emailVerified;
        this.verificationToken = verificationToken;
        this.walletBalance = walletBalance;
        this.badges = badges;
        this.totalSales = totalSales;
        this.averageRating = averageRating;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getProfileImage() {
        return profileImage;
    }
    
    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
    
    public boolean isEmailVerified() {
        return emailVerified;
    }
    
    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }
    
    public String getVerificationToken() {
        return verificationToken;
    }
    
    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }
    
    public Double getWalletBalance() {
        return walletBalance;
    }
    
    public void setWalletBalance(Double walletBalance) {
        this.walletBalance = walletBalance;
    }
    
    public Set<String> getBadges() {
        return badges;
    }
    
    public void setBadges(Set<String> badges) {
        this.badges = badges;
    }
    
    public Integer getTotalSales() {
        return totalSales;
    }
    
    public void setTotalSales(Integer totalSales) {
        this.totalSales = totalSales;
    }
    
    public Double getAverageRating() {
        return averageRating;
    }
    
    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
    
    public Integer getCampusCoins() {
        return campusCoins;
    }
    
    public void setCampusCoins(Integer campusCoins) {
        this.campusCoins = campusCoins;
    }
    
    public String getReferralCode() {
        return referralCode;
    }
    
    public void setReferralCode(String referralCode) {
        this.referralCode = referralCode;
    }
    
    public Integer getTotalReferrals() {
        return totalReferrals;
    }
    
    public void setTotalReferrals(Integer totalReferrals) {
        this.totalReferrals = totalReferrals;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
