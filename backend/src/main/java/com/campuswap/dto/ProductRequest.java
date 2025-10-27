package com.campuswap.dto;

import com.campuswap.entity.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ProductRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @NotNull(message = "Category is required")
    private Product.Category category;

    private boolean exchangeAllowed;
    private String exchangeItem;
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public Product.Category getCategory() {
        return category;
    }
    
    public void setCategory(Product.Category category) {
        this.category = category;
    }
    
    public boolean isExchangeAllowed() {
        return exchangeAllowed;
    }
    
    public void setExchangeAllowed(boolean exchangeAllowed) {
        this.exchangeAllowed = exchangeAllowed;
    }
    
    public String getExchangeItem() {
        return exchangeItem;
    }
    
    public void setExchangeItem(String exchangeItem) {
        this.exchangeItem = exchangeItem;
    }
}
