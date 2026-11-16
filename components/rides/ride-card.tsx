"use client"

import { ChevronRight, Star, Shield, Car } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface Ride {
  id: string
  driver: {
    name: string
    avatar?: string
    rating: number
    trips: number
    verified: boolean
  }
  origin: {
    city: string
    time: string
  }
  destination: {
    city: string
    time: string
  }
  duration: string
  price: number
  seats: number
  car?: {
    model: string
    color: string
  }
}

interface RideCardProps {
  ride: Ride
  onClick?: () => void
}

export function RideCard({ ride, onClick }: RideCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-2xl p-4 border border-border/40 active:scale-[0.98] transition-all duration-200 text-left"
    >
      {/* Timeline de horarios */}
      <div className="flex gap-4">
        {/* Horarios e linha */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-foreground">{ride.origin.time}</span>
          <div className="flex-1 w-0.5 bg-border my-1 min-h-[24px]" />
          <span className="text-xs text-muted-foreground">{ride.duration}</span>
          <div className="flex-1 w-0.5 bg-border my-1 min-h-[24px]" />
          <span className="text-sm font-semibold text-foreground">{ride.destination.time}</span>
        </div>

        {/* Cidades */}
        <div className="flex-1 flex flex-col justify-between py-0.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-medium text-foreground">{ride.origin.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="font-medium text-foreground">{ride.destination.city}</span>
          </div>
        </div>

        {/* Preco */}
        <div className="text-right">
          <span className="text-xl font-bold text-foreground">
            R$ {ride.price}
          </span>
          <p className="text-xs text-muted-foreground">por pessoa</p>
        </div>
      </div>

      {/* Divisor */}
      <div className="h-px bg-border/50 my-4" />

      {/* Info do motorista */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
              {ride.driver.avatar ? (
                <Image
                  src={ride.driver.avatar}
                  alt={ride.driver.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-medium">
                  {ride.driver.name.charAt(0)}
                </div>
              )}
            </div>
            {ride.driver.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center border-2 border-card">
                <Shield className="w-3 h-3 text-accent-foreground" />
              </div>
            )}
          </div>

          {/* Nome e rating */}
          <div>
            <p className="font-medium text-foreground">{ride.driver.name}</p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{ride.driver.rating.toFixed(1)}</span>
              <span>({ride.driver.trips})</span>
            </div>
          </div>
        </div>

        {/* Vagas e seta */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-lg">
            <Car className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{ride.seats}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </button>
  )
}
