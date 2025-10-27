package com.campuswap.controller;

import com.campuswap.entity.Product;
import com.campuswap.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.campuswap.dto.AdminUserDTO;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/products/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getPendingProducts() {
        return ResponseEntity.ok(adminService.getPendingProducts());
    }

    @PutMapping("/products/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> approveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveProduct(id));
    }

    @PutMapping("/products/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> rejectProduct(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectProduct(id));
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminUserDTO>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }
}
