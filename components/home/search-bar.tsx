"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { format, parse } from "date-fns"
import { Search, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"
import { cn } from "@/lib/utils"
import { SEARCH, LABELS } from "@/lib/identity"
import { AddressAutocomplete } from "@/components/maps/address-autocomplete"

import type { AddressSuggestion } from "@/hooks/use-address-search"

interface SearchBarProps {
  variant?: 'default' | 'hero' | 'compact'
  onSearchChange?: (hasValues: boolean) => void
}

export function SearchBar({ variant = 'default', onSearchChange }: SearchBarProps) {
  const searchParams = useSearchParams()
  
  // Inicializar estados com valores da URL
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [originData, setOriginData] = useState<AddressSuggestion | null>(null)
  const [destinationData, setDestinationData] = useState<AddressSuggestion | null>(null)
  const [tripDate, setTripDate] = useState<Date | undefined>(undefined)
  const [tripTime, setTripTime] = useState<string | undefined>(undefined)
  
  // Flag para indicar que estamos inicializando da URL (evita busca automatica)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Sincronizar com parametros da URL quando monta
  useEffect(() => {
    const fromCity = searchParams.get('from')
    const fromState = searchParams.get('fromState')
    const toCity = searchParams.get('to')
    const toState = searchParams.get('toState')
    const dateParam = searchParams.get('date')
    const timeParam = searchParams.get('time')
    
    if (fromCity) {
      setOrigin(fromCity)
      setOriginData({
        city: fromCity,
        state: fromState || 'SP',
        neighborhood: '',
        street: '',
        lat: 0,
        lng: 0,
        displayName: fromCity, // Importante: adiciona displayName
        type: 'city',
        id: `url-origin-${fromCity}`
      })
    }
    
    if (toCity) {
      setDestination(toCity)
      setDestinationData({
        city: toCity,
        state: toState || 'SP',
        neighborhood: '',
        street: '',
        lat: 0,
        lng: 0,
        displayName: toCity, // Importante: adiciona displayName
        type: 'city',
        id: `url-dest-${toCity}`
      })
    }
    
    if (dateParam) {
      try {
        setTripDate(parse(dateParam, 'yyyy-MM-dd', new Date()))
      } catch {
        // Ignora se a data for invalida
      }
    }
    
    if (timeParam) {
      setTripTime(timeParam)
    }
    
    // Marca como inicializado apos um pequeno delay para evitar trigger de busca
    setTimeout(() => setIsInitialized(true), 100)
  }, [searchParams])
  
  const isHero = variant === 'hero'
  const isCompact = variant === 'compact'

  const swapLocations = () => {
    const tempText = origin
    const tempData = originData
    setOrigin(destination)
    setOriginData(destinationData)
    setDestination(tempText)
    setDestinationData(tempData)
  }

  const handleOriginSelect = (suggestion: AddressSuggestion) => {
    setOriginData(suggestion)
  }

  const handleDestinationSelect = (suggestion: AddressSuggestion) => {
    setDestinationData(suggestion)
  }

  // Notifica quando há mudança no estado de busca
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(!!(originData || destinationData))
    }
  }, [originData, destinationData, onSearchChange])

  const handleSearch = () => {
    // Construir URL de busca com os parametros
    const params = new URLSearchParams()
    if (originData) {
      params.set('from', originData.city)
      params.set('fromState', originData.state)
    }
    if (destinationData) {
      params.set('to', destinationData.city)
      params.set('toState', destinationData.state)
    }
    if (tripDate) {
      params.set('date', format(tripDate, 'yyyy-MM-dd'))
    }
    if (tripTime) {
      params.set('time', tripTime)
    }
    
    const searchUrl = `/dashboard/buscar?${params.toString()}`
    
    // Redirecionar para pagina de busca (nao requer login)
    window.location.href = searchUrl
  }

  // Versao compacta - uma linha so
  if (isCompact) {
    return (
      <div className="flex items-center gap-2">
        {/* Origem e Destino inline */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <AddressAutocomplete
            value={origin}
            onChange={(val) => {
              setOrigin(val)
              if (!isInitialized) setIsInitialized(true)
            }}
            onSelect={handleOriginSelect}
            placeholder="Origem"
            icon="origin"
            variant="minimal"
            disableAutoSearch={!isInitialized}
          />
          <button
            onClick={swapLocations}
            className="p-1.5 rounded-lg hover:bg-muted/80 transition-colors flex-shrink-0"
            aria-label="Inverter"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <AddressAutocomplete
            value={destination}
            onChange={(val) => {
              setDestination(val)
              if (!isInitialized) setIsInitialized(true)
            }}
            onSelect={handleDestinationSelect}
            placeholder="Destino"
            icon="destination"
            variant="minimal"
            disableAutoSearch={!isInitialized}
          />
        </div>
        
        {/* Data compacta */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <DatePicker
            value={tripDate}
            onChange={setTripDate}
            placeholder="Data"
            compact
          />
          <TimePicker
            value={tripTime}
            onChange={setTripTime}
            placeholder="Hora"
            compact
          />
        </div>
        
        {/* Botao buscar */}
        <Button onClick={handleSearch} size="sm" className="flex-shrink-0">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn(
      "rounded-2xl p-4 md:p-5",
      isHero ? "shadow-xl shadow-primary/5" : "shadow-sm",
      "bg-zinc-950"
    )}>
      {/* Mobile: Stack vertical | Desktop: Inline horizontal */}
      <div className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
        
        {/* Origem e Destino */}
        <div className="relative flex-1 md:flex md:items-center md:gap-3">
          <div className="space-y-2.5 md:space-y-0 md:flex md:items-center md:gap-3 md:flex-1">
            {/* Origem */}
            <div className="flex-1">
              <AddressAutocomplete
                value={origin}
                onChange={(val) => {
                  setOrigin(val)
                  // Quando usuario digita, habilita busca automatica
                  if (!isInitialized) setIsInitialized(true)
                }}
                onSelect={handleOriginSelect}
                placeholder={SEARCH.placeholder.origin}
                icon="origin"
                disableAutoSearch={!isInitialized}
              />
            </div>

            {/* Linha conectora - mobile only */}
            <div className="absolute left-[22px] top-[46px] h-3 w-0.5 bg-gradient-to-b from-primary/50 to-primary/20 rounded-full md:hidden" />

            {/* Botao de inverter - desktop inline */}
            <button
              onClick={swapLocations}
              className="hidden md:flex p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-full transition-all flex-shrink-0"
              aria-label="Inverter origem e destino"
            >
              <ArrowRightLeft className="h-4 w-4 text-zinc-400" />
            </button>

            {/* Destino */}
            <div className="flex-1">
              <AddressAutocomplete
                value={destination}
                onChange={(val) => {
                  setDestination(val)
                  // Quando usuario digita, habilita busca automatica
                  if (!isInitialized) setIsInitialized(true)
                }}
                onSelect={handleDestinationSelect}
                placeholder={SEARCH.placeholder.destination}
                icon="destination"
                disableAutoSearch={!isInitialized}
              />
            </div>
          </div>

          {/* Botao de inverter - mobile only */}
          <button
            onClick={swapLocations}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-full transition-all md:hidden z-10"
            aria-label="Inverter origem e destino"
          >
            <ArrowRightLeft className="h-4 w-4 text-zinc-400 rotate-90" />
          </button>
        </div>

        {/* Data e Horario */}
        <div className="flex gap-2.5 md:gap-3 md:flex-shrink-0">
          <div className="flex-1 md:w-44">
            <DatePicker
              value={tripDate}
              onChange={setTripDate}
              placeholder={SEARCH.placeholder.date}
            />
          </div>
          <div className="w-28 md:w-32">
            <TimePicker
              value={tripTime}
              onChange={setTripTime}
              placeholder="Horario"
            />
          </div>
        </div>

        {/* Botao de busca - estilo nativo mobile */}
        <Button 
          onClick={handleSearch}
          size="lg"
          className="w-full md:w-auto md:px-8 gap-2 flex-shrink-0"
        >
          <Search className="h-5 w-5" />
          <span>{LABELS.searchRide}</span>
        </Button>
      </div>
    </div>
  )
}
