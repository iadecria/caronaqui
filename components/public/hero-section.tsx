'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/home/search-bar'
import { ArrowRightIcon, CarIcon, UsersIcon, ShieldCheckIcon } from 'lucide-react'
import { TAGLINES, HOME } from '@/lib/identity'
import { heroTaglines } from '@/lib/young-copy'

export function HeroSection() {
  const { isAuthenticated, setShowLoginModal } = useAuth()
  const [dynamicTagline, setDynamicTagline] = useState<string>('')
  
  // Define uma frase dinâmica ao carregar
  useEffect(() => {
    setDynamicTagline(heroTaglines[Math.floor(Math.random() * heroTaglines.length)])
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background Pattern - Grid usando CSS */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="container relative mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <CarIcon className="h-4 w-4" />
            Via Dutra: Rio - São Paulo
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 text-balance">
            {dynamicTagline || TAGLINES.principal}{' '}
            <span className="text-primary">Bora?</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {HOME.cta}
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-10">
            <SearchBar variant="hero" />
          </div>

          {/* CTAs */}
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                onClick={() => setShowLoginModal(true)}
                className="w-full sm:w-auto"
              >
                Criar conta grátis
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowLoginModal(true)}
                className="w-full sm:w-auto"
              >
                Já tenho conta
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground font-mono tabular-nums">2.5k+</p>
              <p className="text-sm text-muted-foreground">Motoristas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground font-mono tabular-nums">15k+</p>
              <p className="text-sm text-muted-foreground">Viagens</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground font-mono tabular-nums">4.8</p>
              <p className="text-sm text-muted-foreground">Avaliacao</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheckIcon className="h-5 w-5 text-primary" />
              <span className="text-sm">Perfis verificados</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <UsersIcon className="h-5 w-5 text-primary" />
              <span className="text-sm">Comunidade ativa</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CarIcon className="h-5 w-5 text-primary" />
              <span className="text-sm">Viagens diarias</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
