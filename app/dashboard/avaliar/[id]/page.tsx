'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star } from 'lucide-react'
import { useRide } from '@/hooks/use-api'
import { reviewsApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// A rota recebe o id da carona (rideId). A avaliacao e enviada via POST /reviews.
export default function AvaliarPage() {
  const params = useParams()
  const router = useRouter()
  const rideId = params.id as string
  const { data: ride, isLoading } = useRide(rideId)

  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!ride) return
    if (rating < 1) {
      setError('Escolha uma nota de 1 a 5 estrelas.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      await reviewsApi.create({
        rideId: ride.id,
        reviewedId: ride.driver.id,
        rating,
        comment: comment || undefined,
        type: 'driver',
      })
      setSuccess(true)
    } catch {
      // Ate a Fase 3 o endpoint /reviews pode nao existir no backend
      setError('Nao foi possivel enviar a avaliacao agora. Tente novamente mais tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <p className="text-muted-foreground text-sm">Carregando...</p>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h1 className="text-xl font-bold mb-2">Carona nao encontrada</h1>
        <Button onClick={() => router.push('/dashboard/minhas-reservas')}>Voltar</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background border-b border-border p-4 z-10 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-primary hover:text-primary/80 transition-colors p-2 -ml-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Avaliar carona</h1>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Como foi sua viagem com</p>
          <p className="text-lg font-semibold text-foreground">{ride.driver.name}?</p>
          <p className="text-sm text-muted-foreground mt-1">
            {ride.origin.city} → {ride.destination.city}
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4 py-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Avaliacao enviada!</h2>
            <p className="text-sm text-muted-foreground">Obrigado por avaliar sua viagem.</p>
            <Button onClick={() => router.push('/dashboard/minhas-reservas')} className="w-full">
              Ver minhas reservas
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={cn(
                      'h-10 w-10 transition-colors',
                      (hovered || rating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    )}
                  />
                </button>
              ))}
            </div>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi a viagem (opcional)"
              rows={4}
            />

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Enviando...' : 'Enviar avaliacao'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
