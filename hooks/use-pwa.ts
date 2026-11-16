'use client'

import { useState, useEffect, useCallback } from 'react'

interface PWAState {
  isInstalled: boolean
  isInstallable: boolean
  isOnline: boolean
  isStandalone: boolean
  isMobile: boolean
  isIOS: boolean
  isAndroid: boolean
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Hook para gerenciar funcionalidades PWA
 * 
 * @example
 * const { isOnline, isInstallable, promptInstall, isStandalone } = usePWA()
 */
export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: true,
    isStandalone: false,
    isMobile: false,
    isIOS: false,
    isAndroid: false,
  })

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  // Detecta ambiente
  useEffect(() => {
    if (typeof window === 'undefined') return

    const ua = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isAndroid = /android/.test(ua)
    const isMobile = isIOS || isAndroid || window.innerWidth < 768
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true

    setState(prev => ({
      ...prev,
      isIOS,
      isAndroid,
      isMobile,
      isStandalone,
      isInstalled: isStandalone,
      isOnline: navigator.onLine,
    }))

    // Listener para beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setState(prev => ({ ...prev, isInstallable: true }))
    }

    // Listener para appinstalled
    const handleAppInstalled = () => {
      setState(prev => ({ ...prev, isInstalled: true, isInstallable: false }))
      setDeferredPrompt(null)
    }

    // Listeners para online/offline
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Funcao para disparar o prompt de instalacao
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setState(prev => ({ ...prev, isInstallable: false }))
        setDeferredPrompt(null)
        return true
      }
      return false
    } catch {
      return false
    }
  }, [deferredPrompt])

  // Vibrar (feedback tatil)
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  // Haptic feedback patterns
  const haptics = {
    light: () => vibrate(10),
    medium: () => vibrate(20),
    heavy: () => vibrate(30),
    success: () => vibrate([10, 50, 10]),
    error: () => vibrate([30, 50, 30, 50, 30]),
    warning: () => vibrate([20, 50, 20]),
  }

  return {
    ...state,
    promptInstall,
    vibrate,
    haptics,
    canInstall: state.isInstallable && !state.isInstalled,
  }
}

/**
 * Hook para detectar se esta em mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}

/**
 * Hook para detectar scroll direction
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      const direction = scrollY > lastScrollY ? 'down' : 'up'
      
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 10) {
        setScrollDirection(direction)
      }
      setLastScrollY(scrollY > 0 ? scrollY : 0)
    }

    window.addEventListener('scroll', updateScrollDirection, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollDirection)
  }, [scrollDirection, lastScrollY])

  return scrollDirection
}

/**
 * Hook para pull-to-refresh
 */
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  useEffect(() => {
    let startY = 0
    const threshold = 80

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startY === 0 || isRefreshing) return
      
      const currentY = e.touches[0].clientY
      const distance = currentY - startY
      
      if (distance > 0 && window.scrollY === 0) {
        setPullDistance(Math.min(distance, threshold * 1.5))
      }
    }

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }
      setPullDistance(0)
      startY = 0
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isRefreshing, pullDistance, onRefresh])

  return { isRefreshing, pullDistance }
}
