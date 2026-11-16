'use client'

import { WifiOff, Wifi } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { cn } from '@/lib/utils'

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOnlineStatus()

  // Nao mostrar nada se online e nao acabou de voltar
  if (isOnline && !wasOffline) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium transition-all duration-300",
        "safe-area-inset-top",
        isOnline 
          ? "bg-green-500 text-white" 
          : "bg-amber-500 text-white"
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>Voce esta online novamente</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Voce esta offline. Algumas funcoes podem nao funcionar.</span>
        </>
      )}
    </div>
  )
}
