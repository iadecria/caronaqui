'use client'

import { useEffect, useCallback } from 'react'
import { useFavoriteDrivers } from '@/contexts/favorite-drivers-context'
import { useNotifications } from '@/contexts/notifications-context'
import type { Ride } from '@/lib/mock-data'

/**
 * Hook que monitora caronas publicadas e notifica quando um motorista favorito publica
 */
export function useFavoriteDriverNotifications(rides: Ride[]) {
  const { favoriteDrivers } = useFavoriteDrivers()
  const { addNotification } = useNotifications()

  const checkForFavoriteDriverRides = useCallback(() => {
    if (favoriteDrivers.length === 0) return

    // Verifica cada carona para ver se é de um motorista favorito
    rides.forEach((ride) => {
      if (favoriteDrivers.includes(ride.driver.id)) {
        // Aqui você pode adicionar lógica para evitar notificar duplicadas
        // Por exemplo, salvar em sessionStorage as caronas já notificadas
        const notificationKey = `notified_${ride.id}`
        if (!sessionStorage.getItem(notificationKey)) {
          addNotification({
            type: 'info',
            title: 'Motorista favorito publicou carona!',
            message: `${ride.driver.name} acabou de publicar uma carona de ${ride.origin.city} para ${ride.destination.city}`,
            action: {
              label: 'Ver carona',
              onClick: () => {
                window.location.href = `/dashboard/carona/${ride.id}`
              }
            }
          })
          sessionStorage.setItem(notificationKey, 'true')
        }
      }
    })
  }, [favoriteDrivers, rides, addNotification])

  // Executa verificação quando caronas mudam
  useEffect(() => {
    checkForFavoriteDriverRides()
  }, [rides, checkForFavoriteDriverRides])

  return { checkForFavoriteDriverRides }
}
