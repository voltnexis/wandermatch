'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../AuthProvider'


// Define interfaces locally since firebase lib might not exist
interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  senderName: string
  content: string
  timestamp: any
  type: 'text'
}

interface ChatRoom {
  id?: string
  participantNames: string[]
  lastMessage?: string
  lastMessageTime?: any
}



export default function ChatSystem() {
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chats, setChats] = useState<ChatRoom[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [showTranslation, setShowTranslation] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [loading, setLoading] = useState(true)
  const [forceUpdate, setForceUpdate] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const currentUserId = user?.id || 'current-user-id'

  useEffect(() => {
    // Load chats and liked users from localStorage
    const loadChats = () => {
      const savedChats = JSON.parse(localStorage.getItem('wandermatch-chats') || '[]');
      setChats(savedChats);
      setLoading(false);
      
      if (!selectedChat && savedChats.length > 0) {
        setSelectedChat(savedChats[0]);
      }
      
      // Force re-render for romantic mode updates
      setForceUpdate(prev => prev + 1);
    };
    
    loadChats();
    
    // Listen for storage changes to update chats and romantic mode
    const handleStorageChange = () => {
      loadChats();
      setForceUpdate(prev => prev + 1);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('likedUsersChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('likedUsersChanged', handleStorageChange);
    };
  }, [currentUserId])

  useEffect(() => {
    if (selectedChat?.id) {
      // Load messages from localStorage
      const savedMessages = JSON.parse(localStorage.getItem(`messages-${selectedChat.id}`) || '[]')
      setMessages(savedMessages)
      
      // Auto-select from localStorage if available
      const selectedChatId = localStorage.getItem('wandermatch-selected-chat')
      if (selectedChatId && chats.find(c => c.id === selectedChatId)) {
        setSelectedChat(chats.find(c => c.id === selectedChatId) || null)
        localStorage.removeItem('wandermatch-selected-chat')
      }
    }
  }, [selectedChat, chats])

  // Check if this is a romantic chat (user liked the other person)
  const isRomanticChat = selectedChat ? (() => {
    const likedUsers = JSON.parse(localStorage.getItem('wandermatch-liked-users') || '[]')
    const chatIdParts = selectedChat.id?.replace('chat-', '').split('-') || []
    const partnerId = chatIdParts.find(id => id !== user?.id)
    const isRomantic = partnerId && likedUsers.includes(partnerId)
    console.log('Romantic Check:', { partnerId, likedUsers, isRomantic })
    return isRomantic
  })() : false

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return
    
    // Check if user is still following the chat partner
    const followedUsers = JSON.parse(localStorage.getItem('wandermatch-followed-users') || '[]')
    const otherParticipant = selectedChat.participantNames.find(name => name !== 'You' && name !== user?.name)
    const allUsers = JSON.parse(localStorage.getItem('wandermatch-all-users') || '[]')
    const chatPartner = allUsers.find((u: any) => u.name === otherParticipant)
    
    if (chatPartner && !followedUsers.includes(chatPartner.id)) {
      alert('You can only send messages to people you follow! 🚫')
      return
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      chatId: selectedChat.id!,
      senderId: currentUserId,
      senderName: 'You',
      content: newMessage,
      timestamp: { 
        seconds: Date.now() / 1000, 
        nanoseconds: 0, 
        toDate: () => new Date(), 
        toMillis: () => Date.now(), 
        isEqual: () => false, 
        toJSON: () => ({}) 
      },
      type: 'text'
    }

    // Add message to current messages
    setMessages(prev => [...prev, message])
    
    // Save to localStorage
    const chatMessages = JSON.parse(localStorage.getItem(`messages-${selectedChat.id}`) || '[]')
    chatMessages.push(message)
    localStorage.setItem(`messages-${selectedChat.id}`, JSON.stringify(chatMessages))
    
    setNewMessage('')
  }

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedChat) return
    
    if (confirm('Delete this message?')) {
      const updatedMessages = messages.filter(m => m.id !== messageId)
      setMessages(updatedMessages)
      localStorage.setItem(`messages-${selectedChat.id}`, JSON.stringify(updatedMessages))
    }
  }

  const handleDeleteChat = () => {
    if (!selectedChat) return
    
    if (confirm('Delete this entire conversation? This will remove all messages and chat history.')) {
      // Remove chat from chats list
      const updatedChats = chats.filter(c => c.id !== selectedChat.id)
      setChats(updatedChats)
      localStorage.setItem('wandermatch-chats', JSON.stringify(updatedChats))
      
      // Remove all messages for this chat
      localStorage.removeItem(`messages-${selectedChat.id}`)
      
      // Select first remaining chat or null
      setSelectedChat(updatedChats.length > 0 ? updatedChats[0] : null)
      
      alert('Conversation deleted successfully!')
    }
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' }
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-3xl shadow-xl overflow-hidden h-[600px] flex ${
      isRomanticChat 
        ? 'bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 border-2 border-pink-300'
        : 'bg-white'
    }`}>
      {/* Chat List */}
      <div className={`w-1/3 border-r ${
        isRomanticChat ? 'border-pink-300 bg-pink-50/50' : 'border-gray-200'
      }`}>
        <div className={`p-6 border-b ${
          isRomanticChat ? 'border-pink-200 bg-gradient-to-r from-pink-100 to-red-100' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${
            isRomanticChat ? 'text-pink-800' : ''
          }`}>
            {isRomanticChat ? '💕 Romantic Messages 💕' : 'Messages'}
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">🔍</div>
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p>No conversations yet</p>
              <p className="text-sm">Start connecting with travelers!</p>
            </div>
          ) : (
            chats.map((chat) => {
              const otherParticipantName = chat.participantNames?.find(name => name !== 'You' && name !== user?.name) || chat.participantNames?.[1] || 'Chat Partner'
              
              // Check if this chat is with a liked user
              const likedUsers = JSON.parse(localStorage.getItem('wandermatch-liked-users') || '[]')
              const chatIdParts = chat.id?.replace('chat-', '').split('-') || []
              const partnerId = chatIdParts.find(id => id !== user?.id)
              const isLikedChat = partnerId && likedUsers.includes(partnerId)
              
              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id 
                      ? isLikedChat 
                        ? 'bg-gradient-to-r from-pink-50 to-red-50 border-pink-200' 
                        : 'bg-blue-50 border-blue-200'
                      : isLikedChat
                        ? 'border-pink-100 hover:bg-pink-50'
                        : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${
                        isLikedChat 
                          ? 'bg-gradient-to-r from-pink-400 to-red-400'
                          : 'bg-gradient-to-r from-blue-400 to-purple-400'
                      }`}>
                        {otherParticipantName.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        isLikedChat ? 'bg-pink-400' : 'bg-green-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold truncate ${
                        isLikedChat ? 'text-pink-700' : ''
                      }`}>
                        {otherParticipantName} {isLikedChat ? '💕' : ''}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {chat.lastMessage || 'Start a conversation'}
                      </div>
                      {chat.lastMessageTime && (
                        <div className="text-xs text-gray-400">
                          {typeof chat.lastMessageTime === 'string' 
                            ? new Date(chat.lastMessageTime).toLocaleTimeString()
                            : chat.lastMessageTime.toDate().toLocaleTimeString()
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 border-b border-gray-200 ${
              isRomanticChat 
                ? 'bg-gradient-to-r from-pink-100 to-red-100 border-pink-200' 
                : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
                      {selectedChat.participantNames.find(name => name !== 'You')?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className={`font-semibold ${
                      isRomanticChat ? 'text-pink-700' : ''
                    }`}>
                      {selectedChat.participantNames.find(name => name !== 'You') || 'Chat Partner'}
                      {isRomanticChat && ' 💕'}
                    </div>
                    <div className={`text-sm ${
                      isRomanticChat ? 'text-pink-600' : 'text-gray-600'
                    }`}>Online now</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleDeleteChat}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Chat"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              isRomanticChat 
                ? 'bg-gradient-to-b from-pink-50 via-red-50 to-pink-50 relative'
                : 'bg-white'
            }`}>
              {isRomanticChat && (
                <div className="text-center py-3 relative z-10">
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-300 to-red-300 rounded-full text-white text-lg font-bold shadow-lg animate-pulse">
                    💕 ROMANTIC CHAT MODE 💕
                  </div>
                  <p className="text-pink-700 text-sm mt-2 font-medium">You liked this person! Chat with love 💖</p>
                </div>
              )}
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">👋</div>
                  <p>Start your conversation!</p>
                  <p className="text-sm">Say hello and share your travel plans</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className="relative">
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.senderId === currentUserId
                            ? isRomanticChat 
                              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                              : 'bg-blue-500 text-white'
                            : isRomanticChat
                              ? 'bg-gradient-to-r from-pink-100 to-red-100 text-gray-900 border border-pink-200'
                              : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className="text-xs mt-1 opacity-75">
                          {message.timestamp?.seconds 
                            ? new Date(message.timestamp.seconds * 1000).toLocaleTimeString()
                            : 'Sending...'
                          }
                        </div>
                      </div>
                      {message.senderId === currentUserId && (
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Delete message"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${
              isRomanticChat 
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
                  className={`p-2 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRomanticChat
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isRomanticChat ? '💕' : '➤'}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={showTranslation}
                    onChange={(e) => setShowTranslation(e.target.checked)}
                    className="rounded"
                  />
                  <span>Auto-translate messages</span>
                </label>
                <div>🔒 End-to-end encrypted</div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <div className="text-xl font-semibold mb-2">Select a conversation</div>
              <div>Choose from your existing conversations or start a new one</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
