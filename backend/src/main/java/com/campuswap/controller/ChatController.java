package com.campuswap.controller;

import com.campuswap.entity.ChatMessage;
import com.campuswap.entity.User;
import com.campuswap.repository.UserRepository;
import com.campuswap.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload Map<String, Object> messageData) {
        Long senderId = Long.valueOf(messageData.get("senderId").toString());
        Long receiverId = Long.valueOf(messageData.get("receiverId").toString());
        Long productId = messageData.containsKey("productId") ? 
                Long.valueOf(messageData.get("productId").toString()) : null;
        String content = messageData.get("content").toString();

        chatService.sendMessage(senderId, receiverId, productId, content);
    }

    @GetMapping("/api/chat/history/{userId}")
    @ResponseBody
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @PathVariable Long userId,
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(chatService.getChatHistory(user.getId(), userId));
    }

    @GetMapping("/api/chat/unread")
    @ResponseBody
    public ResponseEntity<List<ChatMessage>> getUnreadMessages(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(chatService.getUnreadMessages(user.getId()));
    }

    @GetMapping("/api/chat/unread/count")
    @ResponseBody
    public ResponseEntity<Integer> getUnreadCount(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(chatService.getUnreadCount(user.getId()));
    }

    @PutMapping("/api/chat/{messageId}/read")
    @ResponseBody
    public ResponseEntity<Void> markAsRead(@PathVariable Long messageId) {
        chatService.markAsRead(messageId);
        return ResponseEntity.ok().build();
    }
}
