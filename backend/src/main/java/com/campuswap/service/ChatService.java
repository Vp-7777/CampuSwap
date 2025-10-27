package com.campuswap.service;

import com.campuswap.entity.ChatMessage;
import com.campuswap.entity.Product;
import com.campuswap.entity.User;
import com.campuswap.repository.ChatMessageRepository;
import com.campuswap.repository.ProductRepository;
import com.campuswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ChatMessage sendMessage(Long senderId, Long receiverId, Long productId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Product product = null;
        if (productId != null) {
            product = productRepository.findById(productId).orElse(null);
        }

        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setProduct(product);
        message.setContent(content);
        message.setRead(false);

        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Send real-time notification via WebSocket
        messagingTemplate.convertAndSend("/topic/messages/" + receiverId, savedMessage);

        return savedMessage;
    }

    public List<ChatMessage> getChatHistory(Long userId1, Long userId2) {
        return chatMessageRepository.findChatBetweenUsers(userId1, userId2);
    }

    public void markAsRead(Long messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId).orElse(null);
        if (message != null) {
            message.setRead(true);
            chatMessageRepository.save(message);
        }
    }

    public List<ChatMessage> getUnreadMessages(Long userId) {
        return chatMessageRepository.findByReceiverIdAndIsReadFalse(userId);
    }

    public Integer getUnreadCount(Long userId) {
        return chatMessageRepository.countUnreadMessages(userId);
    }
}
