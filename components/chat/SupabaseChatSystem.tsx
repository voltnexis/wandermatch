'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { getChatRooms, getChatMessages, sendChatMessage, createChatRoom } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface ChatRoom {
  id: string;
  participant1: any;
  participant2: any;
  is_romantic: boolean;
  last_message?: string;
  last_message_time?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: any;
  created_at: string;
}

export default function SupabaseChatSystem() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      loadChatRooms();
    }
  }, [user]);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages();
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatRooms = async () => {
    if (!user?.id) return;
    
    try {
      const rooms = await getChatRooms(user.id);
      setChatRooms(rooms);
      if (rooms.length > 0 && !selectedRoom) {
        setSelectedRoom(rooms[0]);
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedRoom) return;
    
    try {
      const msgs = await getChatMessages(selectedRoom.id);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !user?.id) return;

    try {
      await sendChatMessage(selectedRoom.id, user.id, newMessage);
      setNewMessage('');
      loadMessages();
      loadChatRooms(); // Refresh to update last message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherParticipant = (room: ChatRoom) => {
    return room.participant1.id === user?.id ? room.participant2 : room.participant1;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl shadow-xl overflow-hidden h-[600px] flex ${
      selectedRoom?.is_romantic 
        ? 'bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 border-2 border-pink-300'
        : 'bg-white'
    }`}>
      {/* Chat List */}
      <div className={`w-1/3 border-r ${
        selectedRoom?.is_romantic ? 'border-pink-300 bg-pink-50/50' : 'border-gray-200'
      }`}>
        <div className={`p-6 border-b ${
          selectedRoom?.is_romantic ? 'border-pink-200 bg-gradient-to-r from-pink-100 to-red-100' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${
            selectedRoom?.is_romantic ? 'text-pink-800' : ''
          }`}>
            {selectedRoom?.is_romantic ? '💕 Messages 💕' : 'Messages'}
          </h2>
        </div>

        <div className="overflow-y-auto h-full">
          {chatRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p>No conversations yet</p>
            </div>
          ) : (
            chatRooms.map((room) => {
              const otherUser = getOtherParticipant(room);
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    selectedRoom?.id === room.id 
                      ? room.is_romantic 
                        ? 'bg-gradient-to-r from-pink-50 to-red-50 border-pink-200' 
                        : 'bg-blue-50 border-blue-200'
                      : room.is_romantic
                        ? 'border-pink-100 hover:bg-pink-50'
                        : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl relative ${
                      room.is_romantic 
                        ? 'bg-gradient-to-r from-pink-400 to-red-400'
                        : 'bg-gradient-to-r from-blue-400 to-purple-400'
                    }`}>
                      {otherUser.name.charAt(0)}
                      {room.is_romantic && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs animate-pulse">
                          💕
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold truncate ${
                        room.is_romantic ? 'text-pink-700' : ''
                      }`}>
                        {otherUser.name} {room.is_romantic ? '💕' : ''}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {room.last_message || 'Start a conversation'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 border-b ${
              selectedRoom.is_romantic 
                ? 'bg-gradient-to-r from-pink-100 to-red-100 border-pink-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
                  {getOtherParticipant(selectedRoom).name.charAt(0)}
                </div>
                <div>
                  <div className={`font-semibold ${
                    selectedRoom.is_romantic ? 'text-pink-700' : ''
                  }`}>
                    {getOtherParticipant(selectedRoom).name}
                    {selectedRoom.is_romantic && ' 💕'}
                  </div>
                  <div className={`text-sm ${
                    selectedRoom.is_romantic ? 'text-pink-600' : 'text-gray-600'
                  }`}>Online now</div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 relative ${
              selectedRoom.is_romantic 
                ? 'bg-gradient-to-b from-pink-50 via-red-50 to-pink-50'
                : 'bg-white'
            }`}>
              {/* Love background for romantic mode */}
              {selectedRoom.is_romantic && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-10 left-10 text-pink-200 text-4xl animate-pulse">💕</div>
                  <div className="absolute top-20 right-20 text-red-200 text-3xl animate-bounce">❤️</div>
                  <div className="absolute top-40 left-1/4 text-pink-300 text-2xl animate-pulse">💖</div>
                  <div className="absolute top-60 right-1/3 text-red-300 text-3xl animate-bounce">💝</div>
                  <div className="absolute bottom-40 left-20 text-pink-200 text-4xl animate-pulse">💗</div>
                  <div className="absolute bottom-20 right-10 text-red-200 text-2xl animate-bounce">💘</div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-100 text-6xl animate-pulse opacity-30">💕</div>
                </div>
              )}
              
              {selectedRoom.is_romantic && (
                <div className="text-center py-3 relative z-10">
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-300 to-red-300 rounded-full text-white text-lg font-bold shadow-lg animate-pulse">
                    💕 ROMANTIC CHAT MODE 💕
                  </div>
                </div>
              )}
              
              {messages.map((message: any) => {
                // System message (20-day notification)
                if (!message.sender || message.message_type === 'system') {
                  return (
                    <div key={message.id} className="flex justify-center my-4">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg max-w-md text-center">
                        💕 {message.content} 💕
                      </div>
                    </div>
                  );
                }
                
                // Regular user messages
                return (
                  <div
                    key={message.id}
                    className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender.id === user?.id
                          ? selectedRoom.is_romantic 
                            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                            : 'bg-blue-500 text-white'
                          : selectedRoom.is_romantic
                            ? 'bg-gradient-to-r from-pink-100 to-red-100 text-gray-900 border border-pink-200'
                            : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs mt-1 opacity-75">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${
              selectedRoom.is_romantic 
                ? 'border-pink-200 bg-gradient-to-r from-pink-50 to-red-50' 
                : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-2 text-white rounded-full transition-colors disabled:opacity-50 ${
                    selectedRoom.is_romantic
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {selectedRoom.is_romantic ? '💕' : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <div className="text-xl font-semibold mb-2">Select a conversation</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
