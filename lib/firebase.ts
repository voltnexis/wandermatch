import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, where, serverTimestamp, Timestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('Firebase not configured. Chat features will be limited.')
}

const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null
export const db = app ? getFirestore(app) : null
export const auth = app ? getAuth(app) : null

import { Timestamp } from 'firebase/firestore'

export interface ChatMessage {
  id?: string
  chatId: string
  senderId: string
  senderName: string
  content: string
  timestamp: Timestamp
  type: 'text' | 'image' | 'location' | 'voice'
  translated?: string
  originalLanguage?: string
}

export interface ChatRoom {
  id?: string
  participants: string[]
  participantNames: string[]
  lastMessage?: string
  lastMessageTime?: Timestamp
  createdAt: Timestamp
  isRomantic?: boolean
}

// Chat functions
export const createChatRoom = async (chatData: {
  id: string
  participants: string[]
  participantNames: string[]
  lastMessage: string
  lastMessageTime: Date
  isRomantic?: boolean
}) => {
  try {
    const chatRoom: Omit<ChatRoom, 'id'> = {
      participants: chatData.participants,
      participantNames: chatData.participantNames,
      lastMessage: chatData.lastMessage,
      lastMessageTime: serverTimestamp(),
      createdAt: serverTimestamp(),
      isRomantic: chatData.isRomantic || false
    }
    
    const docRef = await addDoc(collection(db, 'chats'), chatRoom)
    return docRef.id
  } catch (error) {
    console.error('Error creating chat room:', error)
    throw new Error('Failed to create chat room')
  }
}

export const sendMessage = async (message: Omit<ChatMessage, 'id'>) => {
  try {
    await addDoc(collection(db, 'messages'), {
      ...message,
      timestamp: serverTimestamp()
    })
  } catch (error) {
    console.error('Error sending message:', error)
    throw new Error('Failed to send message')
  }
}

export const subscribeToMessages = (chatId: string, callback: (messages: ChatMessage[]) => void) => {
  const q = query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('timestamp', 'asc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = []
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ChatMessage)
    })
    callback(messages)
  })
}

export const subscribeToChats = (userId: string, callback: (chats: ChatRoom[]) => void) => {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const chats: ChatRoom[] = []
    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() } as ChatRoom)
    })
    callback(chats)
  })
}

// Translation function (mock - integrate with Google Translate API)
export const translateMessage = async (text: string, targetLanguage: string): Promise<string> => {
  // Mock translation - replace with actual Google Translate API
  const translations: { [key: string]: { [key: string]: string } } = {
    'ml': {
      'Hello': 'ഹലോ',
      'How are you?': 'എങ്ങനെയുണ്ട്?',
      'Thank you': 'നന്ദി'
    },
    'hi': {
      'Hello': 'नमस्ते',
      'How are you?': 'आप कैसे हैं?',
      'Thank you': 'धन्यवाद'
    }
  }
  
  return translations[targetLanguage]?.[text] || text
}