import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import type { PopularRoute } from "@/lib/mock-data"
import { formatPrice } from "@/lib/mock-data"

interface PopularRoutesProps {
  routes: PopularRoute[]
}

export function PopularRoutes({ routes }: PopularRoutesProps) {
  const router = useRouter()

  const handleRouteClick = (route: PopularRoute) => {
    const params = new URLSearchParams()
    params.set('from', route.from)
    params.set('to', route.to)
    // Data padrao: proxima segunda-feira
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    params.set('date', tomorrow.toISOString().split('T')[0])
    // Sem horario fixo - usuario escolhe na tela de busca
    
    router.push(`/dashboard/buscar?${params.toString()}`)
  }

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory md:mx-0 md:px-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4">
      {routes.map((route) => (
        <button
          key={route.id}
          onClick={() => handleRouteClick(route)}
          className="flex-shrink-0 bg-card rounded-2xl p-4 border border-border/60 active:scale-[0.98] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all text-left min-w-[200px] md:min-w-0 md:w-full snap-start"
        >
          {/* Rota */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-semibold text-foreground text-sm truncate">{route.from}</span>
            <div className="p-1 bg-primary/10 rounded-md">
              <ArrowRight className="h-3 w-3 text-primary" />
            </div>
            <span className="font-semibold text-foreground text-sm truncate">{route.to}</span>
          </div>
          
          {/* Info */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {route.ridesAvailable} caronas
            </span>
            <span className="text-sm font-bold text-primary tabular-nums">
              ~{formatPrice(route.averagePrice)}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
