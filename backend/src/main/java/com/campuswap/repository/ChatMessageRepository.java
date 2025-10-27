package com.campuswap.repository;

import com.campuswap.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("SELECT c FROM ChatMessage c WHERE " +
           "(c.sender.id = :userId1 AND c.receiver.id = :userId2) OR " +
           "(c.sender.id = :userId2 AND c.receiver.id = :userId1) " +
           "ORDER BY c.createdAt ASC")
    List<ChatMessage> findChatBetweenUsers(Long userId1, Long userId2);
    
    List<ChatMessage> findByReceiverIdAndIsReadFalse(Long receiverId);
    
    @Query("SELECT COUNT(c) FROM ChatMessage c WHERE c.receiver.id = :userId AND c.isRead = false")
    Integer countUnreadMessages(Long userId);
}
