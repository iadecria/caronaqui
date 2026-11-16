'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { MapPin, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAddressSearch, type AddressSuggestion } from '@/hooks/use-address-search'

/**
 * Destaca a parte do texto que corresponde à query digitada
 */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <>{text}</>

  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const nQuery = normalize(query)
  const nText = normalize(text)
  const index = nText.indexOf(nQuery)

  if (index === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, index)}
      <span className="font-semibold text-primary">{text.slice(index, index + query.length)}</span>
      {text.slice(index + query.length)}
    </>
  )
}

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: AddressSuggestion) => void
  placeholder?: string
  icon?: 'origin' | 'destination'
  className?: string
  disabled?: boolean
  variant?: 'default' | 'minimal'
  /** Se true, desabilita busca automatica (usado quando valor vem da URL) */
  disableAutoSearch?: boolean
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Digite um endereco...',
  icon = 'origin',
  className,
  disabled = false,
  variant = 'default',
  disableAutoSearch = false,
}: AddressAutocompleteProps) {
  const isMinimal = variant === 'minimal'
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const { suggestions, isLoading, error, searchAddress, clearSuggestions } = useAddressSearch()

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Flag que bloqueia o useEffect de buscar quando a mudança veio de uma seleção
  const isSelectingRef = useRef(false)

  // Ref para manter o valor atual de disableAutoSearch
  const disableAutoSearchRef = useRef(disableAutoSearch)
  disableAutoSearchRef.current = disableAutoSearch

  // Busca automática ao digitar — ignorada quando a mudança veio de seleção
  // ou quando disableAutoSearch esta ativo (valor vindo da URL)
  useEffect(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false
      return
    }
    
    // Se disableAutoSearch, nao busca automaticamente
    if (disableAutoSearchRef.current) {
      return
    }

    if (value.length >= 2) {
      searchAddress(value)
      setIsOpen(true)
    } else {
      clearSuggestions()
      setIsOpen(false)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  // Ao clicar numa sugestão: preenche o input com o nome completo e fecha o dropdown
  const handleSelect = (suggestion: AddressSuggestion) => {
    isSelectingRef.current = true       // bloqueia o próximo efeito
    clearSuggestions()
    setIsOpen(false)
    setHighlightedIndex(-1)
    onChange(suggestion.displayName)   // atualiza o valor visível
    onSelect(suggestion)               // propaga dado completo para o pai
  }

  // REMOVIDO: Este efeito estava fechando o dropdown imediatamente apos a busca retornar resultados
  // O problema era que ele verificava se tinha valor e sugestoes, e fechava sempre
  // A logica correta ja esta no handleSelect que fecha ao selecionar

  // Navegação por teclado
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0) handleSelect(suggestions[highlightedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  const handleClear = () => {
    isSelectingRef.current = false
    onChange('')
    clearSuggestions()
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Scroll para item destacado
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  // Fecha ao clicar fora do componente
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Texto principal exibido no dropdown para cada sugestão
  const getDisplayText = (s: AddressSuggestion) =>
    s.type === 'city'
      ? s.city
      : s.street || s.neighborhood || s.city

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        {/* Ícone de origem / destino - apenas no modo default */}
        {!isMinimal && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            {icon === 'origin' ? (
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            ) : (
              <div className="h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
            )}
          </div>
        )}

        {/* Input controlado */}
        {isMinimal ? (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              // NAO abre automaticamente no focus - so abre quando usuario digita
              // Isso evita que o dropdown abra quando a pagina carrega com valores da URL
            }}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        ) : (
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              // NAO abre automaticamente no focus - so abre quando usuario digita
              // Isso evita que o dropdown abra quando a pagina carrega com valores da URL
            }}
            placeholder={placeholder}
            disabled={disabled}
            className="pl-9 pr-10 h-11 md:h-12 text-sm md:text-base placeholder:text-muted-foreground/70"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        )}

        {/* Loading / Limpar - apenas no modo default */}
        {!isMinimal && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : value.length > 0 ? (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault() // evita blur antes do clear
                  handleClear()
                }}
                className="p-1 rounded-full hover:bg-muted transition-colors"
                aria-label="Limpar"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Dropdown de sugestoes - z-index alto para ficar acima do mapa */}
      {isOpen && (suggestions.length > 0 || error) && (
        <div className="absolute z-[100] w-full mt-2 bg-card border border-border/50 rounded-2xl shadow-xl shadow-black/20 overflow-hidden">
          {error ? (
            <p className="p-4 text-sm text-destructive text-center">{error}</p>
          ) : (
            <ul
              ref={listRef}
              role="listbox"
              className="max-h-72 overflow-y-auto py-2"
            >
              {suggestions.map((suggestion, index) => {
                const displayText = getDisplayText(suggestion)
                const isLandmark = suggestion.type === 'landmark'
                const isCity = suggestion.type === 'city'

                return (
                  <li
                    key={suggestion.id}
                    role="option"
                    aria-selected={highlightedIndex === index}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors active:bg-muted/80',
                      highlightedIndex === index ? 'bg-muted' : 'hover:bg-muted/50'
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSelect(suggestion)
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {/* Icone - diferente por tipo */}
                    <div className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0",
                      isCity ? "bg-primary/10" : "bg-muted"
                    )}>
                      <MapPin
                        className={cn(
                          'h-4 w-4',
                          isCity ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    
                    {/* Texto */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        <HighlightMatch text={displayText} query={value} />
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {isLandmark
                          ? `${suggestion.city}, ${suggestion.state}`
                          : suggestion.state}
                      </p>
                    </div>
                    
                    {/* Badge de tipo */}
                    {isCity && (
                      <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-1 rounded-md flex-shrink-0">
                        Cidade
                      </span>
                    )}
                    {isLandmark && (
                      <span className="text-[10px] font-medium bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md flex-shrink-0">
                        Local
                      </span>
                    )}
                    
                    {/* Chevron */}
                    <svg className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
