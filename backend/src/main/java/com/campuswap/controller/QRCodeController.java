package com.campuswap.controller;

import com.campuswap.util.QRCodeUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qrcode")
@CrossOrigin(origins = "http://localhost:3000")
public class QRCodeController {

    @GetMapping("/product/{productId}")
    public ResponseEntity<byte[]> generateProductQRCode(@PathVariable Long productId) {
        try {
            String productUrl = "http://localhost:3000/products/" + productId;
            byte[] qrCode = QRCodeUtil.generateQRCode(productUrl, 300, 300);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);

            return new ResponseEntity<>(qrCode, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
