'use client'

import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    // Verificar status inicial apenas no cliente
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    const handleOnline = () => {
      setIsOnline(true)
      // Se estava offline e voltou, marca flag para mostrar notificacao
      if (!isOnline) {
        setWasOffline(true)
        // Limpa flag apos 3 segundos
        setTimeout(() => setWasOffline(false), 3000)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isOnline])

  return { isOnline, wasOffline }
}
