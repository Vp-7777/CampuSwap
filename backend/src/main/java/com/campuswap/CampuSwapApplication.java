package com.campuswap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CampuSwapApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(CampuSwapApplication.class, args);
        System.out.println("🚀 CampuSwap Backend Started Successfully!");
    }
}
