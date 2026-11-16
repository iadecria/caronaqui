'use client'

import { useParams, useRouter } from 'next/navigation'
import { CheckCircle2, Ticket, Search, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RideTicket } from '@/components/ride-detail/ride-ticket'
import { mockRides } from '@/lib/mock-data'

// Gera um código de protocolo determinístico a partir do id (evita mismatch de hidratação)
function buildCode(rideId: string): string {
  let hash = 0
  for (let i = 0; i < rideId.length; i++) {
    hash = (hash * 31 + rideId.charCodeAt(i)) >>> 0
  }
  const num = (hash % 1_000_000).toString().padStart(6, '0')
  return `CQ-${num}`
}

export default function ReservaConfirmadaPage() {
  const params = useParams()
  const router = useRouter()
  const rideId = params.id as string
  const ride = mockRides.find((r) => r.id === rideId)

  if (!ride) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h1 className="text-xl font-bold mb-2">Carona não encontrada</h1>
        <p className="text-muted-foreground mb-4 text-sm">Não foi possível localizar esta carona.</p>
        <Button onClick={() => router.push('/dashboard/buscar')}>Buscar caronas</Button>
      </div>
    )
  }

  const code = buildCode(rideId)

  return (
    <div className="px-4 py-6 md:py-10 max-w-md mx-auto">
      {/* Cabeçalho de sucesso */}
      <div className="text-center mb-6">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <CheckCircle2 className="h-9 w-9 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Solicitação enviada!
        </h1>
        <p className="text-sm text-muted-foreground mt-2 text-pretty">
          Avisamos {ride.driver.name.split(' ')[0]} sobre seu interesse. Você receberá uma
          notificação assim que a carona for confirmada.
        </p>
      </div>

      {/* Status pendente */}
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
        <p className="text-xs text-amber-200/90">
          Aguardando confirmação do motorista
        </p>
      </div>

      {/* Bilhete */}
      <RideTicket ride={ride} code={code} seats={1} />

      {/* Ações */}
      <div className="mt-6 space-y-3">
        <Button
          size="lg"
          className="w-full h-12 gap-2"
          onClick={() => router.push('/dashboard/minhas-reservas')}
        >
          <Ticket className="h-4 w-4" />
          Ver minhas reservas
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full h-12 gap-2"
          onClick={() => router.push('/dashboard/buscar')}
        >
          <Search className="h-4 w-4" />
          Buscar outras caronas
        </Button>
      </div>
    </div>
  )
}
