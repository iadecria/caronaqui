// Hook para facilitar a troca entre mock data e API real
// Define NEXT_PUBLIC_USE_MOCK_DATA=false para usar a API Laravel

import useSWR, { SWRConfiguration } from 'swr'
import { api, ApiError } from '@/lib/api'
import { mockRides, mockPopularRoutes } from '@/lib/mock-data'
import type { Ride, PopularRoute, Booking, RideFilters } from '@/lib/types'
import { USE_MOCK } from '@/lib/config'

// Fetcher generico para SWR
async function fetcher<T>(endpoint: string): Promise<T> {
  return api<T>(endpoint)
}

// ============================================
// CARONAS
// ============================================

export function useRides(filters?: RideFilters, swrConfig?: SWRConfiguration) {
  // Modo mock
  if (USE_MOCK) {
    let filtered = [...mockRides]

    if (filters?.originCity) {
      filtered = filtered.filter(r =>
        r.origin.city.toLowerCase().includes(filters.originCity!.toLowerCase())
      )
    }
    if (filters?.destinationCity) {
      filtered = filtered.filter(r =>
        r.destination.city.toLowerCase().includes(filters.destinationCity!.toLowerCase())
      )
    }
    if (filters?.date) {
      filtered = filtered.filter(r => r.date === filters.date)
    }
    if (filters?.seats) {
      filtered = filtered.filter(r => r.availableSeats >= filters.seats!)
    }
    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter(r => r.price <= filters.maxPrice!)
    }
    if (filters?.allowsPets) {
      filtered = filtered.filter(r => r.allowsPets)
    }
    if (filters?.ladiesOnly) {
      filtered = filtered.filter(r => r.ladiesOnly)
    }

    return {
      data: filtered,
      error: undefined,
      isLoading: false,
      mutate: () => Promise.resolve(filtered),
    }
  }

  // Modo API real
  const params = new URLSearchParams()
  if (filters?.originCity) params.append('origin_city', filters.originCity)
  if (filters?.destinationCity) params.append('destination_city', filters.destinationCity)
  if (filters?.date) params.append('date', filters.date)
  if (filters?.seats) params.append('seats', String(filters.seats))
  if (filters?.maxPrice !== undefined) params.append('max_price', String(filters.maxPrice))
  if (filters?.allowsPets !== undefined) params.append('allows_pets', String(filters.allowsPets))
  if (filters?.ladiesOnly !== undefined) params.append('ladies_only', String(filters.ladiesOnly))

  const query = params.toString()
  const endpoint = `/rides${query ? `?${query}` : ''}`

  const { data, error, isLoading, mutate } = useSWR<{ data: Ride[] }>(
    endpoint,
    fetcher,
    swrConfig
  )

  return {
    data: data?.data,
    error: error as ApiError | undefined,
    isLoading,
    mutate,
  }
}

export function useRide(id: string, swrConfig?: SWRConfiguration) {
  // Modo mock
  if (USE_MOCK) {
    const ride = mockRides.find(r => r.id === id)
    return {
      data: ride,
      error: ride ? undefined : new Error('Carona nao encontrada'),
      isLoading: false,
      mutate: () => Promise.resolve(ride),
    }
  }

  // Modo API real
  const { data, error, isLoading, mutate } = useSWR<{ data: Ride }>(
    id ? `/rides/${id}` : null,
    fetcher,
    swrConfig
  )

  return {
    data: data?.data,
    error: error as ApiError | undefined,
    isLoading,
    mutate,
  }
}

export function useMyRides(swrConfig?: SWRConfiguration) {
  // Modo mock
  if (USE_MOCK) {
    return {
      data: mockRides,
      error: undefined,
      isLoading: false,
      mutate: () => Promise.resolve(mockRides),
    }
  }

  // Modo API real
  const { data, error, isLoading, mutate } = useSWR<{ data: Ride[] }>(
    '/rides/my',
    fetcher,
    swrConfig
  )

  return {
    data: data?.data,
    error: error as ApiError | undefined,
    isLoading,
    mutate,
  }
}

export function usePopularRoutes(swrConfig?: SWRConfiguration) {
  // Modo mock
  if (USE_MOCK) {
    return {
      data: mockPopularRoutes,
      error: undefined,
      isLoading: false,
      mutate: () => Promise.resolve(mockPopularRoutes),
    }
  }

  // Modo API real
  const { data, error, isLoading, mutate } = useSWR<{ data: PopularRoute[] }>(
    '/rides/popular-routes',
    fetcher,
    swrConfig
  )

  return {
    data: data?.data,
    error: error as ApiError | undefined,
    isLoading,
    mutate,
  }
}

// ============================================
// RESERVAS
// ============================================

export function useBookings(swrConfig?: SWRConfiguration) {
  // Modo mock: sem reservas ainda (sera populado na Fase 3)
  if (USE_MOCK) {
    const empty: Booking[] = []
    return {
      data: empty,
      error: undefined,
      isLoading: false,
      mutate: () => Promise.resolve(empty),
    }
  }

  // Modo API real
  const { data, error, isLoading, mutate } = useSWR<{ data: Booking[] }>(
    '/bookings',
    fetcher,
    swrConfig
  )

  return {
    data: data?.data,
    error: error as ApiError | undefined,
    isLoading,
    mutate,
  }
}

// ============================================
// HELPERS
// ============================================

export function useMockMode() {
  return USE_MOCK
}
