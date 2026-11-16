// Hook para facilitar a troca entre mock data e API real
// Define NEXT_PUBLIC_USE_MOCK_DATA=false para usar a API Laravel

import useSWR, { SWRConfiguration } from 'swr'
import { api, ApiError } from '@/lib/api'
import { mockRides, mockPopularRoutes, type Ride, type PopularRoute } from '@/lib/mock-data'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

// Fetcher generico para SWR
async function fetcher<T>(endpoint: string): Promise<T> {
  return api<T>(endpoint)
}

// ============================================
// CARONAS
// ============================================

interface UseRidesOptions {
  originCity?: string
  destinationCity?: string
  date?: string
  seats?: number
}

export function useRides(options?: UseRidesOptions, swrConfig?: SWRConfiguration) {
  // Modo mock
  if (USE_MOCK) {
    let filtered = [...mockRides]
    
    if (options?.originCity) {
      filtered = filtered.filter(r => 
        r.origin.city.toLowerCase().includes(options.originCity!.toLowerCase())
      )
    }
    if (options?.destinationCity) {
      filtered = filtered.filter(r => 
        r.destination.city.toLowerCase().includes(options.destinationCity!.toLowerCase())
      )
    }
    if (options?.date) {
      filtered = filtered.filter(r => r.date === options.date)
    }
    if (options?.seats) {
      filtered = filtered.filter(r => r.availableSeats >= options.seats!)
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
  if (options?.originCity) params.append('origin_city', options.originCity)
  if (options?.destinationCity) params.append('destination_city', options.destinationCity)
  if (options?.date) params.append('date', options.date)
  if (options?.seats) params.append('seats', String(options.seats))
  
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
// HELPERS
// ============================================

export function useMockMode() {
  return USE_MOCK
}
