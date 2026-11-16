'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { 
  searchLocations, 
  isCity, 
  type CityInfo, 
  type LandmarkInfo,
  CITIES_VIA_DUTRA
} from '@/lib/cities-abbreviations'

export interface AddressSuggestion {
  id: string
  displayName: string
  city: string
  state: string
  neighborhood: string
  street: string
  lat: number
  lng: number
  type: 'city' | 'landmark' | 'address'
  isLocal?: boolean // true se veio das abreviacoes locais
}

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  type: string
  address: {
    road?: string
    suburb?: string
    neighbourhood?: string
    city?: string
    town?: string
    village?: string
    municipality?: string
    state?: string
    country?: string
  }
}

// Coordenadas aproximadas das cidades principais (centro da cidade)
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Sao Paulo': { lat: -23.5505, lng: -46.6333 },
  'Guarulhos': { lat: -23.4543, lng: -46.5337 },
  'Aruja': { lat: -23.3967, lng: -46.3211 },
  'Santa Isabel': { lat: -23.3147, lng: -46.2242 },
  'Jacarei': { lat: -23.3053, lng: -45.9658 },
  'Sao Jose dos Campos': { lat: -23.1896, lng: -45.8841 },
  'Cacapava': { lat: -23.1008, lng: -45.7069 },
  'Taubate': { lat: -23.0269, lng: -45.5556 },
  'Tremembe': { lat: -22.9583, lng: -45.5500 },
  'Pindamonhangaba': { lat: -22.9244, lng: -45.4617 },
  'Roseira': { lat: -22.8961, lng: -45.3075 },
  'Aparecida': { lat: -22.8494, lng: -45.2294 },
  'Guaratingueta': { lat: -22.8167, lng: -45.1928 },
  'Lorena': { lat: -22.7308, lng: -45.1247 },
  'Cachoeira Paulista': { lat: -22.6647, lng: -44.9867 },
  'Cruzeiro': { lat: -22.5767, lng: -44.9614 },
  'Lavrinhas': { lat: -22.5706, lng: -44.9022 },
  'Queluz': { lat: -22.5353, lng: -44.7758 },
  'Resende': { lat: -22.4689, lng: -44.4467 },
  'Itatiaia': { lat: -22.4964, lng: -44.5633 },
  'Penedo': { lat: -22.4217, lng: -44.5203 },
  'Porto Real': { lat: -22.4175, lng: -44.2878 },
  'Barra Mansa': { lat: -22.5442, lng: -44.1714 },
  'Volta Redonda': { lat: -22.5232, lng: -44.1042 },
  'Barra do Pirai': { lat: -22.4711, lng: -43.8261 },
  'Piraí': { lat: -22.6289, lng: -43.8981 },
  'Seropedica': { lat: -22.7431, lng: -43.7083 },
  'Nova Iguacu': { lat: -22.7556, lng: -43.4503 },
  'Duque de Caxias': { lat: -22.7856, lng: -43.3117 },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
  'Niteroi': { lat: -22.8833, lng: -43.1036 }
}

// Coordenadas de landmarks importantes
const LANDMARK_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // SAO PAULO
  'Rodoviaria Tiete': { lat: -23.5169, lng: -46.6256 },
  'Rodoviaria Barra Funda': { lat: -23.5253, lng: -46.6672 },
  'Aeroporto de Guarulhos': { lat: -23.4356, lng: -46.4731 },
  // SJC
  'Rodoviaria de SJC': { lat: -23.1789, lng: -45.8867 },
  'Shopping Vale Sul': { lat: -23.1878, lng: -45.8844 },
  'Shopping Colinas': { lat: -23.2089, lng: -45.8731 },
  'CenterVale Shopping': { lat: -23.2156, lng: -45.9003 },
  'Praca Afonso Pena': { lat: -23.1794, lng: -45.8842 },
  'Aquarius': { lat: -23.2100, lng: -45.8900 },
  'Havan SJC': { lat: -23.2200, lng: -45.9050 },
  'CTA': { lat: -23.2108, lng: -45.8747 },
  'INPE': { lat: -23.2114, lng: -45.8672 },
  'UNIVAP': { lat: -23.2006, lng: -45.8831 },
  // TAUBATE
  'Rodoviaria de Taubate': { lat: -23.0261, lng: -45.5547 },
  'Taubate Shopping': { lat: -23.0208, lng: -45.5478 },
  'PetroVal Taubate': { lat: -23.0150, lng: -45.5400 },
  'Centro de Taubate': { lat: -23.0269, lng: -45.5556 },
  'UNITAU': { lat: -23.0283, lng: -45.5522 },
  // GUARATINGUETA
  'Rodoviaria de Guaratingueta': { lat: -22.8167, lng: -45.1928 },
  'Shopping Patio Guara': { lat: -22.8150, lng: -45.1900 },
  // LORENA
  'Rodoviaria de Lorena': { lat: -22.7308, lng: -45.1247 },
  'Havan Lorena': { lat: -22.7250, lng: -45.1150 },
  'Centro de Lorena': { lat: -22.7308, lng: -45.1247 },
  // APARECIDA
  'Santuario Nacional de Aparecida': { lat: -22.8519, lng: -45.2267 },
  'Rodoviaria de Aparecida': { lat: -22.8500, lng: -45.2300 },
  // RIO
  'Rodoviaria Novo Rio': { lat: -22.8989, lng: -43.2089 },
  'Aeroporto Galeao': { lat: -22.8103, lng: -43.2506 },
  'Aeroporto Santos Dumont': { lat: -22.9106, lng: -43.1631 },
  'Shopping Nova America': { lat: -22.8750, lng: -43.2633 },
  'Norte Shopping': { lat: -22.8536, lng: -43.2633 },
  'Barra Shopping': { lat: -23.0003, lng: -43.3650 },
  // VOLTA REDONDA
  'Rodoviaria de Volta Redonda': { lat: -22.5232, lng: -44.1042 },
  'Sider Shopping': { lat: -22.5200, lng: -44.1000 },
  // RESENDE
  'Rodoviaria de Resende': { lat: -22.4689, lng: -44.4467 },
  'AMAN': { lat: -22.4500, lng: -44.4400 }
}

export function useAddressSearch() {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Converte item local para AddressSuggestion
  const convertLocalToSuggestion = useCallback((
    item: CityInfo | LandmarkInfo
  ): AddressSuggestion | null => {
    if (isCity(item)) {
      const coords = CITY_COORDINATES[item.name]
      if (!coords) return null
      
      return {
        id: `local-city-${item.name}`,
        displayName: `${item.name}, ${item.state}`,
        city: item.name,
        state: item.state,
        neighborhood: '',
        street: '',
        lat: coords.lat,
        lng: coords.lng,
        type: 'city',
        isLocal: true
      }
    } else {
      const coords = LANDMARK_COORDINATES[item.name]
      if (!coords) {
        // Usa coordenada da cidade
        const cityCoords = CITY_COORDINATES[item.city]
        if (!cityCoords) return null
        
        return {
          id: `local-landmark-${item.name}`,
          displayName: `${item.name} - ${item.city}, ${item.state}`,
          city: item.city,
          state: item.state,
          neighborhood: '',
          street: item.name,
          lat: cityCoords.lat,
          lng: cityCoords.lng,
          type: 'landmark',
          isLocal: true
        }
      }
      
      return {
        id: `local-landmark-${item.name}`,
        displayName: `${item.name} - ${item.city}, ${item.state}`,
        city: item.city,
        state: item.state,
        neighborhood: '',
        street: item.name,
        lat: coords.lat,
        lng: coords.lng,
        type: 'landmark',
        isLocal: true
      }
    }
  }, [])

  const searchAddress = useCallback(async (query: string) => {
    // Limpa debounce anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Cancela requisicao anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Minimo 2 caracteres para busca
    if (query.trim().length < 2) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    // Primeiro busca localmente (instantaneo)
    const localResults = searchLocations(query)
    const localSuggestions = localResults
      .map(convertLocalToSuggestion)
      .filter((s): s is AddressSuggestion => s !== null)

    // Mostra resultados locais imediatamente
    if (localSuggestions.length > 0) {
      setSuggestions(localSuggestions)
    }

    // Se tiver poucos resultados locais, busca na API
    if (localSuggestions.length < 5) {
      // Debounce de 300ms para API
      debounceRef.current = setTimeout(async () => {
        abortControllerRef.current = new AbortController()

        try {
          // Busca mais ampla incluindo POIs (amenity, shop, tourism)
          const params = new URLSearchParams({
            q: query,
            format: 'json',
            addressdetails: '1',
            limit: '8',
            countrycodes: 'br',
            'accept-language': 'pt-BR',
            // Regiao Vale do Paraiba e adjacencias
            viewbox: '-47.5,-24.5,-42.5,-21.5',
            bounded: '0',
            // Inclui POIs como shoppings, rodoviarias, postos
            extratags: '1'
          })

          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${params}`,
            {
              signal: abortControllerRef.current.signal,
              headers: {
                'User-Agent': 'CaronAqui/1.0'
              }
            }
          )

          if (!response.ok) {
            throw new Error('Erro ao buscar enderecos')
          }

          const data: NominatimResult[] = await response.json()

          const apiSuggestions: AddressSuggestion[] = data.map((result) => {
            const city = result.address.city || 
                         result.address.town || 
                         result.address.village || 
                         result.address.municipality || 
                         ''
            
            const state = result.address.state || ''
            const stateAbbr = state.includes('Paulo') ? 'SP' : 
                             state.includes('Janeiro') ? 'RJ' : 
                             state.substring(0, 2).toUpperCase()

            return {
              id: String(result.place_id),
              displayName: result.display_name,
              city,
              state: stateAbbr,
              neighborhood: result.address.suburb || result.address.neighbourhood || '',
              street: result.address.road || '',
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
              type: 'address' as const,
              isLocal: false
            }
          })

          // Prioriza cidades da Via Dutra nos resultados da API
          const viaDutraCities = CITIES_VIA_DUTRA.map(c => c.name.toLowerCase())
          const sortedApi = apiSuggestions.sort((a, b) => {
            const aInViaDutra = viaDutraCities.some(c => 
              a.city.toLowerCase().includes(c)
            )
            const bInViaDutra = viaDutraCities.some(c => 
              b.city.toLowerCase().includes(c)
            )

            if (aInViaDutra && !bInViaDutra) return -1
            if (!aInViaDutra && bInViaDutra) return 1
            return 0
          })

          // Combina locais + API, removendo duplicatas
          const seen = new Set(localSuggestions.map(s => s.city.toLowerCase()))
          const uniqueApi = sortedApi.filter(s => !seen.has(s.city.toLowerCase()))
          
          setSuggestions([...localSuggestions, ...uniqueApi].slice(0, 8))
          setIsLoading(false)
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') {
            return
          }
          // Mantem resultados locais mesmo com erro na API
          if (localSuggestions.length === 0) {
            setError('Erro ao buscar enderecos. Tente novamente.')
          }
          setIsLoading(false)
        }
      }, 300)
    } else {
      setIsLoading(false)
    }
  }, [convertLocalToSuggestion])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    suggestions,
    isLoading,
    error,
    searchAddress,
    clearSuggestions
  }
}
