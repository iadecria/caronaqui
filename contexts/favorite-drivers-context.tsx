'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface FavoriteDriversContextType {
  favoriteDrivers: string[]
  favoriteDriverIds: string[]
  addFavoriteDriver: (driverId: string) => void
  removeFavoriteDriver: (driverId: string) => void
  toggleFavoriteDriver: (driverId: string) => void
  isFavoriteDriver: (driverId: string) => boolean
  clearFavoriteDrivers: () => void
}

const FavoriteDriversContext = createContext<FavoriteDriversContextType | undefined>(undefined)

const STORAGE_KEY = 'caronaqui_favorite_drivers'

export function FavoriteDriversProvider({ children }: { children: ReactNode }) {
  const [favoriteDrivers, setFavoriteDrivers] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Carregar motoristas favoritos do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setFavoriteDrivers(parsed)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar motoristas favoritos:', error)
    }
    setIsHydrated(true)
  }, [])

  // Persistir motoristas favoritos no localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteDrivers))
      } catch (error) {
        console.error('Erro ao salvar motoristas favoritos:', error)
      }
    }
  }, [favoriteDrivers, isHydrated])

  const addFavoriteDriver = useCallback((driverId: string) => {
    setFavoriteDrivers(prev => {
      if (prev.includes(driverId)) return prev
      return [...prev, driverId]
    })
  }, [])

  const removeFavoriteDriver = useCallback((driverId: string) => {
    setFavoriteDrivers(prev => prev.filter(id => id !== driverId))
  }, [])

  const toggleFavoriteDriver = useCallback((driverId: string) => {
    setFavoriteDrivers(prev => {
      if (prev.includes(driverId)) {
        return prev.filter(id => id !== driverId)
      }
      return [...prev, driverId]
    })
  }, [])

  const isFavoriteDriver = useCallback((driverId: string) => {
    return favoriteDrivers.includes(driverId)
  }, [favoriteDrivers])

  const clearFavoriteDrivers = useCallback(() => {
    setFavoriteDrivers([])
  }, [])

  return (
    <FavoriteDriversContext.Provider
      value={{
        favoriteDrivers,
        favoriteDriverIds: favoriteDrivers,
        addFavoriteDriver,
        removeFavoriteDriver,
        toggleFavoriteDriver,
        isFavoriteDriver,
        clearFavoriteDrivers,
      }}
    >
      {children}
    </FavoriteDriversContext.Provider>
  )
}

export function useFavoriteDrivers() {
  const context = useContext(FavoriteDriversContext)
  if (context === undefined) {
    throw new Error('useFavoriteDrivers deve ser usado dentro de FavoriteDriversProvider')
  }
  return context
}
