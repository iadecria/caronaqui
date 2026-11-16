'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Notification, NotificationType } from '@/lib/types'

export type { NotificationType }

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

const STORAGE_KEY = 'caronaqui_notifications'

// Notificacoes mockadas iniciais
const initialNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'reservation',
    title: 'Nova reserva!',
    message: 'Ana Oliveira reservou 2 lugares na sua carona para Sao Paulo em 18/04.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min atras
    read: false,
    rideId: 'r1'
  },
  {
    id: 'n2',
    type: 'message',
    title: 'Nova mensagem',
    message: 'Carlos Silva: "Ola! Posso levar uma mala grande?"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h atras
    read: false,
    userId: 'd1'
  },
  {
    id: 'n3',
    type: 'reminder',
    title: 'Lembrete de viagem',
    message: 'Sua carona para Rio de Janeiro e amanha as 07:30. Nao esqueca!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h atras
    read: true,
    rideId: 'r2'
  },
  {
    id: 'n4',
    type: 'rating',
    title: 'Avalie sua viagem',
    message: 'Como foi sua experiencia com Roberto Santos na carona de ontem?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atras
    read: true,
    rideId: 'r3',
    actionUrl: '/dashboard/avaliar/r3'
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Bem-vindo ao CaronAqui!',
    message: 'Complete seu perfil para aumentar suas chances de conseguir caronas.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 dias atras
    read: true,
    actionUrl: '/dashboard/perfil'
  }
]

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Carrega do localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setNotifications(JSON.parse(stored))
      } catch {
        setNotifications(initialNotifications)
      }
    } else {
      setNotifications(initialNotifications)
    }
    setIsLoaded(true)
  }, [])

  // Persiste no localStorage
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications, isLoaded])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `n${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}
