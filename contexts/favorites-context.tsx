'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface FavoritesContextType {
  favorites: string[]
  addFavorite: (rideId: string) => void
  removeFavorite: (rideId: string) => void
  toggleFavorite: (rideId: string) => void
  isFavorite: (rideId: string) => boolean
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const STORAGE_KEY = 'caronaqui_favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Carregar favoritos do localStorage na montagem
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setFavorites(parsed)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
    }
    setIsHydrated(true)
  }, [])

  // Persistir favoritos no localStorage quando mudar
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error('Erro ao salvar favoritos:', error)
      }
    }
  }, [favorites, isHydrated])

  const addFavorite = useCallback((rideId: string) => {
    setFavorites(prev => {
      if (prev.includes(rideId)) return prev
      return [...prev, rideId]
    })
  }, [])

  const removeFavorite = useCallback((rideId: string) => {
    setFavorites(prev => prev.filter(id => id !== rideId))
  }, [])

  const toggleFavorite = useCallback((rideId: string) => {
    setFavorites(prev => {
      if (prev.includes(rideId)) {
        return prev.filter(id => id !== rideId)
      }
      return [...prev, rideId]
    })
  }, [])

  const isFavorite = useCallback((rideId: string) => {
    return favorites.includes(rideId)
  }, [favorites])

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
