'use client'

import { useMemo, useState, useEffect } from 'react'
import type { Ride } from '@/lib/types'
import { RidesList } from '@/components/home/rides-list'
import { Car, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SearchResultsProps {
  rides: Ride[]
  filters: {
    priceRange: [number, number]
    selectedDate?: Date
    selectedComforts: string[]
    timeWindow?: { start: string; end: string } | null
    fromCity?: string | null
    toCity?: string | null
  }
}

// Normaliza texto para comparacao (remove acentos, lowercase)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

// Abreviacoes comuns de cidades
const cityAbbreviations: Record<string, string[]> = {
  'sao jose dos campos': ['sjc', 'sao jose', 'saojose'],
  'taubate': ['tau'],
  'sao paulo': ['sp', 'sampa'],
  'rio de janeiro': ['rj', 'rio'],
}

// Verifica se duas cidades correspondem (considerando abreviacoes)
function citiesMatch(rideCity: string, searchCity: string): boolean {
  const normalizedRide = normalizeText(rideCity)
  const normalizedSearch = normalizeText(searchCity)
  
  // Match direto
  if (normalizedRide.includes(normalizedSearch) || normalizedSearch.includes(normalizedRide)) {
    return true
  }
  
  // Verifica abreviacoes
  for (const [fullName, abbreviations] of Object.entries(cityAbbreviations)) {
    const isRideMatch = normalizedRide.includes(fullName) || abbreviations.some(abbr => normalizedRide.includes(abbr))
    const isSearchMatch = normalizedSearch.includes(fullName) || abbreviations.some(abbr => normalizedSearch === abbr || normalizedSearch.includes(fullName))
    
    if (isRideMatch && isSearchMatch) {
      return true
    }
    
    // Se a busca e uma abreviacao e a cidade da carona e o nome completo
    if (abbreviations.includes(normalizedSearch) && normalizedRide.includes(fullName)) {
      return true
    }
  }
  
  return false
}

// Verifica se a carona esta no futuro
function isRideInFuture(rideDate: string, rideTime: string): boolean {
  const now = new Date()
  const [year, month, day] = rideDate.split('-').map(Number)
  const [hours, minutes] = rideTime.split(':').map(Number)
  const rideDateTime = new Date(year, month - 1, day, hours, minutes)
  return rideDateTime > now
}

export function SearchResults({ rides, filters }: SearchResultsProps) {
  // Estado para evitar hidratacao mismatch - so filtra no cliente
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredRides = useMemo(() => {
    // No servidor, retorna todas as caronas sem filtro de tempo
    // Isso evita mismatch de hidratacao
    if (!isMounted) {
      return rides
    }
    const results = rides.filter(ride => {
      // Filtro de cidade de origem
      if (filters.fromCity) {
        if (!citiesMatch(ride.origin.city, filters.fromCity)) {
          return false
        }
      }

      // Filtro de cidade de destino
      if (filters.toCity) {
        if (!citiesMatch(ride.destination.city, filters.toCity)) {
          return false
        }
      }

      // Se nao tem filtro de cidade, mostra todas as caronas futuras
      if (!filters.fromCity && !filters.toCity) {
        if (!isRideInFuture(ride.date, ride.time)) {
          return false
        }
        return true
      }

      // Filtro de preco - so aplica se alterou do padrao
      const price = typeof ride.price === 'number' ? ride.price : parseInt(String(ride.price).replace(/[^\d]/g, ''))
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) {
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
          return false
        }
      }

      // Filtro de confortos
      if (filters.selectedComforts.length > 0) {
        const rideComforts: string[] = []
        if (ride.allowsPets) rideComforts.push('pets')
        if (ride.allowsLuggage) rideComforts.push('luggage')
        if (!ride.allowsSmoking) rideComforts.push('noSmoking')
        
        const hasAllComforts = filters.selectedComforts.every(comfort => 
          rideComforts.includes(comfort)
        )
        if (!hasAllComforts) {
          return false
        }
      }

      // Filtro de data - se selecionou uma data, mostra apenas caronas desse dia
      if (filters.selectedDate) {
        const filterDate = new Date(filters.selectedDate)
        const [year, month, day] = ride.date.split('-').map(Number)
        const rideDate = new Date(year, month - 1, day)
        
        // Compara apenas ano, mês e dia (ignora hora)
        if (
          filterDate.getFullYear() !== rideDate.getFullYear() ||
          filterDate.getMonth() !== rideDate.getMonth() ||
          filterDate.getDate() !== rideDate.getDate()
        ) {
          return false
        }
      }

      // Filtro de horario - se selecionou, mostra caronas a partir daquele horario para frente
      // Se nao selecionou, mostra todas as caronas futuras (sera ordenado depois)
      if (!isRideInFuture(ride.date, ride.time)) {
        return false
      }
      
      // Se tem horario selecionado, filtra apenas caronas a partir daquele horario
      if (filters.timeWindow) {
        const rideTime = ride.time
        const rideMinutes = parseInt(rideTime.split(':')[0]) * 60 + parseInt(rideTime.split(':')[1])
        const startMinutes = parseInt(filters.timeWindow.start.split(':')[0]) * 60 + parseInt(filters.timeWindow.start.split(':')[1])
        
        // So mostra caronas que saem no horario selecionado ou depois
        if (rideMinutes < startMinutes) {
          return false
        }
      }

      return true
    })

    // Ordenar por data e hora (mais proximas primeiro)
    results.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })

    return results
  }, [rides, filters, isMounted])

  // Estado vazio com mensagem amigavel
  if (filteredRides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted/80 flex items-center justify-center mb-5">
          <Search className="w-10 h-10 text-muted-foreground/70" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Nenhuma carona encontrada
        </h3>
        <p className="text-muted-foreground text-sm max-w-[280px] mb-8 leading-relaxed">
          Nao encontramos caronas para esta rota no momento. 
          Que tal publicar sua propria carona?
        </p>
        <div className="flex flex-col gap-3 w-full max-w-[260px]">
          <Button asChild size="lg" className="rounded-xl h-12 font-semibold shadow-lg shadow-primary/20">
            <Link href="/dashboard/publicar">
              <Car className="w-5 h-5 mr-2" />
              Oferecer carona
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl h-12 font-medium">
            <Link href="/dashboard/buscar">
              <Search className="w-4 h-4 mr-2" />
              Nova busca
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <RidesList 
      rides={filteredRides} 
      title="Caronas disponiveis"
    />
  )
}
