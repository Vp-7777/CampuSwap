import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  const sellerId = searchParams.get('sellerId');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (sellerId) {
      // Auto-select conversation with this seller
      const chat = conversations.find(c => 
        c.seller?.id === parseInt(sellerId) || c.buyer?.id === parseInt(sellerId)
      );
      if (chat) {
        setSelectedChat(chat);
        loadMessages(chat.id);
      }
    }
  }, [sellerId, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      // Mock conversations - in real app, this would load from API
      setConversations([
        {
          id: 1,
          seller: { id: 1, fullName: 'Test Seller', email: 'seller@test.com' },
          lastMessage: 'Is this still available?',
          timestamp: new Date().toISOString(),
          unread: 2
        }
      ]);
    } catch (error) {
      console.error('Failed to load conversations', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      // Mock messages - in real app, this would load from API
      setMessages([
        {
          id: 1,
          sender: { id: 2, fullName: 'You' },
          content: 'Hi, is this product still available?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true
        },
        {
          id: 2,
          sender: { id: 1, fullName: 'Test Seller' },
          content: 'Yes, it\'s available! When would you like to meet?',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          isRead: true
        },
        {
          id: 3,
          sender: { id: 2, fullName: 'You' },
          content: 'Great! Can we meet tomorrow at 3 PM?',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          isRead: true
        }
      ]);
    } catch (error) {
      console.error('Failed to load messages', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    // Add message to UI immediately
    const tempMessage = {
      id: messages.length + 1,
      sender: { id: user.userId, fullName: 'You' },
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setMessages([...messages, tempMessage]);
    setNewMessage('');

    // In real app, send to API
    try {
      // await chatAPI.sendMessage({ receiverId: selectedChat.seller.id, content: newMessage });
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No conversations yet</p>
              <p className="text-sm mt-2">Start chatting with sellers!</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedChat(conv);
                  loadMessages(conv.id);
                }}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedChat?.id === conv.id ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">
                      {conv.seller.fullName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{conv.seller.fullName}</h3>
                      {conv.unread > 0 && (
                        <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold">
                  {selectedChat.seller.fullName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{selectedChat.seller.fullName}</h3>
                <p className="text-sm text-gray-500">{selectedChat.seller.email}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isOwnMessage = msg.sender.id === user.userId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isOwnMessage
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-900 border'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-indigo-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>Send</span>
                  <span>📤</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-xl mb-2">💬</p>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
