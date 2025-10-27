package com.campuswap.dto;

import com.campuswap.entity.User;

import java.time.LocalDateTime;

public class AdminUserDTO {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private Integer campusCoins;
    private Integer totalReferrals;
    private LocalDateTime createdAt;

    public static AdminUserDTO fromEntity(User u) {
        AdminUserDTO d = new AdminUserDTO();
        d.id = u.getId();
        d.email = u.getEmail();
        d.fullName = u.getFullName();
        d.role = u.getRole().name();
        d.campusCoins = u.getCampusCoins();
        d.totalReferrals = u.getTotalReferrals();
        d.createdAt = u.getCreatedAt();
        return d;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
    public Integer getCampusCoins() { return campusCoins; }
    public Integer getTotalReferrals() { return totalReferrals; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
