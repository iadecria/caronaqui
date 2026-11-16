'use client'

import { Star, Users, PawPrint, Cigarette, Luggage, ShieldCheck, Heart, ChevronRight, AlertCircle } from "lucide-react"
import Image from "next/image"
import type { Ride } from "@/lib/mock-data"
import { formatDate, formatPrice } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/contexts/favorites-context"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { getPriceComment } from "@/lib/young-copy"

interface RideCardProps {
  ride: Ride
  onClick?: () => void
  requiresAuth?: boolean
}

export function RideCard({ ride, onClick, requiresAuth = false }: RideCardProps) {
  const router = useRouter()
  const { isAuthenticated, setShowLoginModal, setLoginRedirectPath } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  
  const favorited = isFavorite(ride.id)
  
  // Calcula preço médio (simplicidade: média de todos os preços vistos)
  const averagePrice = 30 // Preço médio de referência para a rota Rio-SP/Taubatá-SJC
  const priceComment = getPriceComment(ride.price, averagePrice)
  const isExpensive = ride.price > averagePrice * 1.3
  const isCheap = ride.price < averagePrice * 0.85

  const handleClick = () => {
    if (onClick) {
      // Se requiresAuth esta ativo E usuario nao esta autenticado, mostra login
      if (requiresAuth && !isAuthenticated) {
        setLoginRedirectPath(`/dashboard/carona/${ride.id}`)
        setShowLoginModal(true)
        return
      }
      onClick()
    } else {
      // Navegacao direta para detalhes - SEMPRE permite visualizacao sem login
      // Login so sera exigido ao tentar reservar, favoritar ou enviar mensagem
      router.push(`/dashboard/carona/${ride.id}`)
    }
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }
    toggleFavorite(ride.id)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-card rounded-2xl p-4 border border-border/40 active:scale-[0.98] active:bg-muted/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-200 text-left h-full flex flex-col group"
    >
      {/* Header: Motorista */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative flex-shrink-0">
            <Image
              src={ride.driver.avatar}
              alt={ride.driver.name}
              width={48}
              height={48}
              className="rounded-full bg-muted w-12 h-12 object-cover ring-2 ring-background"
            />
            {ride.driver.verifiedId && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-primary rounded-full p-0.5 ring-2 ring-card">
                <ShieldCheck className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground truncate">{ride.driver.name}</p>
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-foreground">{ride.driver.rating}</span>
              <span className="text-xs text-muted-foreground">({ride.driver.totalRides})</span>
            </div>
          </div>
        </div>
        
        {/* Favorito */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleFavoriteClick}
          onKeyDown={(e) => e.key === 'Enter' && handleFavoriteClick(e as unknown as React.MouseEvent)}
          className={cn(
            "p-2 rounded-full transition-all duration-200 touch-target flex items-center justify-center cursor-pointer",
            favorited 
              ? "bg-red-500/10 text-red-500" 
              : "bg-muted/60 text-muted-foreground hover:bg-muted"
          )}
          aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={cn("h-5 w-5", favorited && "fill-current")} />
        </div>
      </div>

      {/* Rota */}
      <div className="relative pl-5 mb-4 flex-1">
        {/* Linha vertical */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 rounded-full" />
        
        {/* Origem */}
        <div className="relative mb-4">
          <div className="absolute -left-5 top-0.5 h-3.5 w-3.5 rounded-full bg-primary shadow-md shadow-primary/30" />
          <p className="font-medium text-foreground">{ride.origin.city}, {ride.origin.state}</p>
          <p className="text-xs text-muted-foreground">{ride.origin.neighborhood}</p>
        </div>

        {/* Destino */}
        <div className="relative">
          <div className="absolute -left-5 top-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-primary bg-card" />
          <p className="font-medium text-foreground">{ride.destination.city}, {ride.destination.state}</p>
          <p className="text-xs text-muted-foreground">{ride.destination.neighborhood}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          {/* Data e hora */}
          <span 
            className="text-xs font-medium text-foreground bg-muted/80 px-2.5 py-1.5 rounded-lg tabular-nums"
            suppressHydrationWarning
          >
            {formatDate(ride.date)} • {ride.time}
          </span>
          
          {/* Vagas */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">{ride.availableSeats}</span>
          </div>
          
          {/* Amenidades */}
          <div className="flex items-center gap-1">
            {ride.allowsPets && (
              <div className="p-1 bg-muted/60 rounded-md" title="Aceita pets">
                <PawPrint className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
            {ride.allowsLuggage && (
              <div className="p-1 bg-muted/60 rounded-md" title="Aceita bagagem">
                <Luggage className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
            {!ride.allowsSmoking && (
              <div className="p-1 bg-muted/60 rounded-md" title="Nao fumante">
                <Cigarette className="h-3.5 w-3.5 text-muted-foreground line-through" />
              </div>
            )}
          </div>
        </div>
        
        {/* Preço */}
        <div className="flex items-center gap-2">
          <div className="text-right flex-1">
            <p className={cn(
              "text-lg font-bold tabular-nums",
              isExpensive ? "text-orange-600 dark:text-orange-400" : "text-primary"
            )}>
              {formatPrice(ride.price)}
            </p>
            <p className={cn(
              "text-[10px] -mt-0.5",
              isExpensive ? "text-orange-600/70 dark:text-orange-400/70 font-medium" :
              isCheap ? "text-green-600/70 dark:text-green-400/70 font-medium" :
              "text-muted-foreground"
            )}>
              {isExpensive ? priceComment : isCheap ? priceComment : "por pessoa"}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  )
}
