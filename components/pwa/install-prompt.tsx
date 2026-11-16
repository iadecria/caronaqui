'use client'

import { useState, useEffect } from 'react'
import { Download, X, Share, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePWA } from '@/hooks/use-pwa'
import { cn } from '@/lib/utils'

/**
 * Componente de prompt para instalacao do PWA
 * Mostra instrucoes diferentes para iOS (manual) e Android (automatico)
 */
export function InstallPrompt() {
  const { canInstall, promptInstall, isIOS, isStandalone, haptics } = usePWA()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (isStandalone || isDismissed) return

    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10)
      const daysSinceDismissed = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        setIsDismissed(true)
        return
      }
    }

    const timer = setTimeout(() => {
      if (canInstall || isIOS) {
        setIsVisible(true)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [canInstall, isIOS, isStandalone, isDismissed])

  const handleInstall = async () => {
    haptics.medium()
    const installed = await promptInstall()
    if (installed) {
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    haptics.light()
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  if (!isVisible || isStandalone) return null

  // iOS: Instrucoes manuais
  if (isIOS) {
    return (
      <div className={cn(
        "fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300",
        "bg-card border border-border/60 rounded-2xl p-4 shadow-xl"
      )}>
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors"
          aria-label="Fechar"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
        
        <div className="flex items-start gap-3 pr-8">
          <div className="p-2.5 bg-primary/10 rounded-xl flex-shrink-0">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Instalar CaronAqui</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Adicione a tela inicial para acesso rapido
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-xl">
          <p className="text-sm text-foreground mb-2 font-medium">Como instalar:</p>
          <ol className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">1</span>
              Toque em <Share className="h-4 w-4 inline mx-1 text-primary" /> Compartilhar
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">2</span>
              Selecione <Plus className="h-4 w-4 inline mx-1" /> Adicionar a Tela Inicial
            </li>
          </ol>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDismiss}
          className="w-full mt-3 text-muted-foreground"
        >
          Agora nao
        </Button>
      </div>
    )
  }

  // Android/Desktop: Prompt automatico
  if (!canInstall) return null

  return (
    <div className={cn(
      "fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80",
      "bg-card border border-border/60 rounded-2xl p-4 shadow-xl",
      "animate-in slide-in-from-bottom-4 duration-300"
    )}>
      <button 
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors"
        aria-label="Fechar"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
      
      <div className="flex items-start gap-3 pr-8">
        <div className="p-2.5 bg-primary/10 rounded-xl flex-shrink-0">
          <Download className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Instalar CaronAqui</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Instale o app para acesso rapido e offline
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDismiss}
          className="flex-1"
        >
          Agora nao
        </Button>
        <Button 
          size="sm" 
          onClick={handleInstall}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Instalar
        </Button>
      </div>
    </div>
  )
}
