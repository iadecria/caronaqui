'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { mockRides, mockPopularRoutes } from '@/lib/mock-data'
import { SearchFilters, defaultFilters, type SearchFiltersState } from '@/components/search/search-filters'
import { SearchResults } from '@/components/search/search-results'
import { TimeQuickSelect } from '@/components/search/time-quick-select'
import { PopularRoutes } from '@/components/home/popular-routes'
import { SearchBar } from '@/components/home/search-bar'
import { QuickFilters } from '@/components/home/quick-filters'
import { VisualTagsHighlight } from '@/components/home/visual-tags-highlight'
import { SearchRouteMap } from '@/components/maps/search-route-map'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAuth } from '@/contexts/auth-context'
import { useAddressSearch } from '@/hooks/use-address-search'
import { Button } from '@/components/ui/button'
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { SlidersHorizontal, Calendar, TrendingUp, Clock, ArrowUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AddressSuggestion } from '@/hooks/use-address-search'

// Headline dinamico baseado em autenticacao
function getHeadline(user: any, isAuthenticated: boolean): string {
  if (isAuthenticated && user?.name) {
    const firstName = user.name.split(' ')[0]
    return `Fala, ${firstName}!`
  }
  return "Qual o rolê de hoje?"
}

// Função helper para obter coordenadas de cidades conhecidas
function getCityCoordinates(city: string): { lat: number; lng: number } | null {
  const coordinates: Record<string, { lat: number; lng: number }> = {
    'São Paulo': { lat: -23.5505, lng: -46.6333 },
    'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
    'São José dos Campos': { lat: -23.1815, lng: -45.8877 },
    'Resende': { lat: -22.4690, lng: -44.4509 },
    'Guaratinguetá': { lat: -22.7928, lng: -45.1958 },
    'Ubatuba': { lat: -23.4428, lng: -45.0754 },
  }
  
  const normalized = city.trim()
  return coordinates[normalized] || null
}

// Calcula janela de horario client-side only
function calculateTimeWindowClient(time: string, hoursWindow: number): { start: string; end: string } | null {
  if (!time) return null
  
  const [hours, minutes] = time.split(':').map(Number)
  const now = new Date()
  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()
  
  // Calcula inicio da janela (horario selecionado - hoursWindow)
  let startHours = hours - hoursWindow
  let startMinutes = minutes
  
  // Se o inicio calculado ja passou, usa o horario atual
  if (startHours < currentHours || (startHours === currentHours && startMinutes < currentMinutes)) {
    startHours = currentHours
    startMinutes = currentMinutes
  }
  
  // Calcula fim da janela (horario selecionado + hoursWindow)
  let endHours = hours + hoursWindow
  let endMinutes = minutes
  
  // Limites
  if (startHours < 0) startHours = 0
  if (endHours > 23) endHours = 23
  
  const start = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`
  const end = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  
  return { start, end }
}

export default function BuscarPage() {
  const { user, isAuthenticated } = useAuth()
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Estado para controlar se esta montado (client-side)
  const [isMounted, setIsMounted] = useState(false)
  
  // Estados de filtros e ordenacao
  const [filters, setFilters] = useState<SearchFiltersState>(defaultFilters)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'rating'>('time')
  const [quickFiltersTags, setQuickFiltersTags] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  
  // Estados para gerenciar origem e destino com dados completos
  const [originSuggestion, setOriginSuggestion] = useState<AddressSuggestion | undefined>()
  const [destinationSuggestion, setDestinationSuggestion] = useState<AddressSuggestion | undefined>()
  const [isMapLoading, setIsMapLoading] = useState(false)
  
  // Verifica se tem parametros de busca na URL
  const hasSearchParams = searchParams.get('from') || searchParams.get('to')
  const [showResults, setShowResults] = useState(!!hasSearchParams)

  const firstName = user?.name?.split(' ')[0] || 'Viajante'
  const headline = getHeadline(user, isAuthenticated)

  // Marca como montado apos hidratacao
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Atualiza showResults quando URL muda
  useEffect(() => {
    setShowResults(!!hasSearchParams)
  }, [hasSearchParams])
  
  // Sincroniza origin e destination quando URL muda
  // Aqui simulamos o carregamento dos dados (em um app real, faria uma busca na API)
  useEffect(() => {
    const fromCity = searchParams.get('from')
    const fromState = searchParams.get('fromState')
    const toCity = searchParams.get('to')
    const toState = searchParams.get('toState')
    
    setIsMapLoading(true)
    
    // Simula delay de carregamento
    const timer = setTimeout(() => {
      if (fromCity) {
        setOriginSuggestion({
          id: `url-origin-${fromCity}`,
          displayName: fromCity,
          city: fromCity,
          state: fromState || 'SP',
          fullAddress: `${fromCity}, ${fromState || 'SP'}`,
          neighborhood: '',
          lat: getCityCoordinates(fromCity)?.lat || -23.5505,
          lng: getCityCoordinates(fromCity)?.lng || -46.6333,
          type: 'city'
        })
      }
      
      if (toCity) {
        setDestinationSuggestion({
          id: `url-dest-${toCity}`,
          displayName: toCity,
          city: toCity,
          state: toState || 'RJ',
          fullAddress: `${toCity}, ${toState || 'RJ'}`,
          neighborhood: '',
          lat: getCityCoordinates(toCity)?.lat || -22.9068,
          lng: getCityCoordinates(toCity)?.lng || -43.1729,
          type: 'city'
        })
      }
      
      setIsMapLoading(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchParams])

  // Informacoes da busca atual
  const fromCity = searchParams.get('from')
  const toCity = searchParams.get('to')
  const searchDate = searchParams.get('date')
  
  // Calcula janela de horario apenas no cliente
  const timeWindow = useMemo(() => {
    if (!isMounted || !selectedTime) return null
    return calculateTimeWindowClient(selectedTime, 3) // ±3 horas ao redor da hora selecionada
  }, [isMounted, selectedTime])

  // Filtros convertidos para o formato esperado por SearchResults
  // Combina os confortos do drawer com os chips rápidos (sem duplicar)
  const resultsFilters = useMemo(() => {
    const comforts = new Set<string>([
      ...(filters.allowsPets ? ['pets'] : []),
      ...(filters.allowsLuggage ? ['luggage'] : []),
      ...(filters.noSmoking ? ['noSmoking'] : []),
      ...quickFiltersTags,
    ])
    return {
      priceRange: filters.priceRange,
      selectedDate: filters.date,
      selectedComforts: Array.from(comforts),
      timeWindow: timeWindow,
      fromCity: fromCity,
      toCity: toCity,
    }
  }, [filters, quickFiltersTags, timeWindow, fromCity, toCity])

  // Conta filtros ativos
  const activeFiltersCount = [
    filters.priceRange[0] > 0 || filters.priceRange[1] < 200,
    filters.allowsPets === true,
    filters.allowsLuggage === true,
    filters.noSmoking === true,
    filters.minSeats > 1
  ].filter(Boolean).length

  return (
    <div className="w-full min-h-screen bg-zinc-950 flex flex-col">
      {/* Header com saudacao */}
      <div className="px-4 pt-5 pb-3 md:px-6 md:pt-8">
        {!showResults && (
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-6">
            {headline}
          </h1>
        )}
        {showResults && (
          <>
            <p className="text-muted-foreground text-sm mb-1">
              Buscando caronas em
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {fromCity || 'Origem'} → {toCity || 'Destino'}
            </h1>
          </>
        )}
        {showResults && searchDate && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1.5 rounded-lg">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              {(() => {
                const [year, month, day] = searchDate.split('-').map(Number)
                const date = new Date(year, month - 1, day)
                return date.toLocaleDateString('pt-BR', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short' 
                })
              })()}
            </span>
            {isMounted && timeWindow && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1.5 rounded-lg tabular-nums">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                {timeWindow.start} - {timeWindow.end}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Barra de busca - compacta quando tem resultados */}
      {!showResults && (
        <>
          <div className="px-4 pb-5 md:px-6">
            <SearchBar variant="default" />
          </div>

          {/* Tags Visuais Highlight - Diferencial do App */}
          <VisualTagsHighlight />

          {/* Filtros Rápidos */}
          <QuickFilters onFilterChange={setQuickFiltersTags} />
        </>
      )}

      {/* Conteudo principal */}
      <div className="flex-1 flex flex-col">
        {!showResults ? (
          <div className="px-4 pb-6 md:px-6 space-y-6">
            {/* Rotas populares */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-base font-semibold text-foreground">Rotas populares</h2>
              </div>
              <PopularRoutes routes={mockPopularRoutes} />
            </section>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 px-4 pb-6 md:px-6 h-full">
            {/* Coluna esquerda: Busca, filtros e resultados (2 colunas no desktop) */}
            <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
              {/* Barra de busca compacta - editavel */}
              <div className="bg-card border border-border/50 rounded-xl p-3">
                <SearchBar variant="compact" />
              </div>

              {/* Barra de acoes: Filtros e Ordenacao */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {/* Botao de filtros */}
                <Drawer open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <DrawerTrigger asChild>
                    <Button 
                      variant={activeFiltersCount > 0 ? "default" : "outline"} 
                      size="sm" 
                      className="gap-2 rounded-full flex-shrink-0"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filtros
                      {activeFiltersCount > 0 && (
                        <span className="ml-1 w-5 h-5 rounded-full bg-primary-foreground/20 text-xs flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="border-b border-border/50">
                      <DrawerTitle>Filtrar caronas</DrawerTitle>
                      <DrawerDescription>
                        Ajuste os filtros para encontrar a carona ideal
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 py-4 max-h-[65vh] overflow-y-auto space-y-6">
                      <TimeQuickSelect
                        selectedTime={selectedTime}
                        onTimeSelect={setSelectedTime}
                      />
                      <div className="border-t border-border/50 pt-6">
                        <SearchFilters
                          filters={filters}
                          onFiltersChange={setFilters}
                          onApply={() => setIsFiltersOpen(false)}
                        />
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>

                {/* Separador */}
                <div className="w-px h-6 bg-border flex-shrink-0" />

                {/* Ordenacao */}
                <Button
                  variant={sortBy === 'time' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-full flex-shrink-0 text-xs"
                  onClick={() => setSortBy('time')}
                >
                  Mais cedo
                </Button>
                <Button
                  variant={sortBy === 'price' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-full flex-shrink-0 text-xs"
                  onClick={() => setSortBy('price')}
                >
                  Menor preco
                </Button>
                <Button
                  variant={sortBy === 'rating' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-full flex-shrink-0 text-xs"
                  onClick={() => setSortBy('rating')}
                >
                  Melhor avaliado
                </Button>
              </div>

              {/* Chips de filtro rápido - filtram a lista instantaneamente */}
              <QuickFilters
                variant="compact"
                value={quickFiltersTags}
                onFilterChange={setQuickFiltersTags}
              />

              {/* Resultados com scroll - flex-1 para ocupar espaço restante */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <SearchResults rides={mockRides} filters={resultsFilters} />
              </div>
            </div>

            {/* Coluna direita: Mapa (hidden em mobile e tablet, visível em lg) */}
            {originSuggestion && destinationSuggestion && (
              <div className="hidden lg:flex flex-col min-h-0 sticky top-4">
                <SearchRouteMap
                  origin={originSuggestion}
                  destination={destinationSuggestion}
                  isLoading={isMapLoading}
                  className="h-[500px] lg:h-full"
                />
              </div>
            )}

            {/* Mapa em mobile/tablet - expandido abaixo dos resultados */}
            {!isMobile && originSuggestion && destinationSuggestion && (
              <div className="lg:hidden col-span-full mt-4">
                <div className="text-sm font-medium text-foreground mb-2">Rota do percurso</div>
                <SearchRouteMap
                  origin={originSuggestion}
                  destination={destinationSuggestion}
                  isLoading={isMapLoading}
                  className="h-64"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
