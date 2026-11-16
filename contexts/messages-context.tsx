'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

// Tipos
export interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: string
  rideId: string
  // Participantes
  passengerId: string
  passengerName: string
  passengerAvatar: string
  driverId: string
  driverName: string
  driverAvatar: string
  // Info da carona
  rideOrigin: string
  rideDestination: string
  rideDate: string
  ridePrice: number
  // Status
  status: 'active' | 'ride_requested' | 'ride_accepted' | 'ride_rejected' | 'completed'
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

// Mock de conversas para demonstracao
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    rideId: '1',
    passengerId: 'user-1',
    passengerName: 'Voce',
    passengerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    driverId: 'driver-1',
    driverName: 'Carlos Silva',
    driverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    rideOrigin: 'Sao Jose dos Campos',
    rideDestination: 'Sao Paulo',
    rideDate: '2026-04-30',
    ridePrice: 45,
    status: 'active',
    lastMessage: 'Ola! Passo no CenterVale sim, sem problema.',
    lastMessageTime: '2026-04-29T10:30:00',
    unreadCount: 1,
  },
  {
    id: 'conv-2',
    rideId: '2',
    passengerId: 'user-1',
    passengerName: 'Voce',
    passengerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    driverId: 'driver-2',
    driverName: 'Ana Costa',
    driverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    rideOrigin: 'Taubate',
    rideDestination: 'Rio de Janeiro',
    rideDate: '2026-05-01',
    ridePrice: 85,
    status: 'ride_accepted',
    lastMessage: 'Perfeito! Te vejo na rodoviaria entao.',
    lastMessageTime: '2026-04-28T18:45:00',
    unreadCount: 0,
  },
]

// Mock de mensagens
const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'user-1',
      text: 'Ola Carlos! Tenho interesse na sua carona de SJC para SP. Voce passa proximo ao CenterVale?',
      timestamp: '2026-04-29T10:00:00',
      read: true,
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'driver-1',
      text: 'Ola! Passo no CenterVale sim, sem problema.',
      timestamp: '2026-04-29T10:30:00',
      read: false,
    },
  ],
  'conv-2': [
    {
      id: 'msg-3',
      conversationId: 'conv-2',
      senderId: 'user-1',
      text: 'Oi Ana! Posso embarcar na rodoviaria de Taubate?',
      timestamp: '2026-04-28T18:00:00',
      read: true,
    },
    {
      id: 'msg-4',
      conversationId: 'conv-2',
      senderId: 'driver-2',
      text: 'Claro! Passo la por volta das 7h.',
      timestamp: '2026-04-28T18:20:00',
      read: true,
    },
    {
      id: 'msg-5',
      conversationId: 'conv-2',
      senderId: 'user-1',
      text: 'Otimo! Vou solicitar a carona entao.',
      timestamp: '2026-04-28T18:30:00',
      read: true,
    },
    {
      id: 'msg-6',
      conversationId: 'conv-2',
      senderId: 'driver-2',
      text: 'Perfeito! Te vejo na rodoviaria entao.',
      timestamp: '2026-04-28T18:45:00',
      read: true,
    },
  ],
}

interface MessagesContextType {
  conversations: Conversation[]
  getConversation: (id: string) => Conversation | undefined
  getConversationByRide: (rideId: string) => Conversation | undefined
  getMessages: (conversationId: string) => Message[]
  sendMessage: (conversationId: string, text: string) => void
  startConversation: (params: {
    rideId: string
    driverId: string
    driverName: string
    driverAvatar: string
    rideOrigin: string
    rideDestination: string
    rideDate: string
    ridePrice: number
    initialMessage: string
  }) => string // Retorna o ID da conversa
  requestRide: (conversationId: string) => void
  acceptRide: (conversationId: string) => void
  rejectRide: (conversationId: string) => void
  markAsRead: (conversationId: string) => void
  totalUnread: number
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined)

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES)

  const getConversation = useCallback((id: string) => {
    return conversations.find(c => c.id === id)
  }, [conversations])

  const getConversationByRide = useCallback((rideId: string) => {
    return conversations.find(c => c.rideId === rideId)
  }, [conversations])

  const getMessages = useCallback((conversationId: string) => {
    return messages[conversationId] || []
  }, [messages])

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const now = new Date().toISOString()
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'user-1', // Usuario logado
      text,
      timestamp: now,
      read: true,
    }

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }))

    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, lastMessage: text, lastMessageTime: now }
          : c
      )
    )
  }, [])

  const startConversation = useCallback((params: {
    rideId: string
    driverId: string
    driverName: string
    driverAvatar: string
    rideOrigin: string
    rideDestination: string
    rideDate: string
    ridePrice: number
    initialMessage: string
  }) => {
    const existingConv = conversations.find(c => c.rideId === params.rideId)
    if (existingConv) {
      // Se ja existe conversa, apenas envia a mensagem
      sendMessage(existingConv.id, params.initialMessage)
      return existingConv.id
    }

    const now = new Date().toISOString()
    const convId = `conv-${Date.now()}`
    
    const newConversation: Conversation = {
      id: convId,
      rideId: params.rideId,
      passengerId: 'user-1',
      passengerName: 'Voce',
      passengerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      driverId: params.driverId,
      driverName: params.driverName,
      driverAvatar: params.driverAvatar,
      rideOrigin: params.rideOrigin,
      rideDestination: params.rideDestination,
      rideDate: params.rideDate,
      ridePrice: params.ridePrice,
      status: 'active',
      lastMessage: params.initialMessage,
      lastMessageTime: now,
      unreadCount: 0,
    }

    const firstMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: 'user-1',
      text: params.initialMessage,
      timestamp: now,
      read: true,
    }

    setConversations(prev => [newConversation, ...prev])
    setMessages(prev => ({ ...prev, [convId]: [firstMessage] }))

    return convId
  }, [conversations, sendMessage])

  const requestRide = useCallback((conversationId: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, status: 'ride_requested' } : c
      )
    )
    // Envia mensagem automatica
    sendMessage(conversationId, 'Gostaria de solicitar uma vaga nesta carona.')
  }, [sendMessage])

  const acceptRide = useCallback((conversationId: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, status: 'ride_accepted' } : c
      )
    )
  }, [])

  const rejectRide = useCallback((conversationId: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, status: 'ride_rejected' } : c
      )
    )
  }, [])

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      )
    )
    setMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(m => ({ ...m, read: true })),
    }))
  }, [])

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        getConversation,
        getConversationByRide,
        getMessages,
        sendMessage,
        startConversation,
        requestRide,
        acceptRide,
        rejectRide,
        markAsRead,
        totalUnread,
      }}
    >
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessagesContext)
  if (!context) {
    throw new Error('useMessages deve ser usado dentro de MessagesProvider')
  }
  return context
}
