'use client'

import { 
  MapPin, 
  Navigation, 
  CalendarDays, 
  Car, 
  DollarSign, 
  PawPrint, 
  Cigarette, 
  Luggage,
  Users,
  Edit3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePublish } from '@/contexts/publish-context'
import { formatPrice, formatDate } from '@/lib/format'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PUBLISH } from '@/lib/identity'

interface ReviewItemProps {
  icon: React.ElementType
  label: string
  value: string | React.ReactNode
  step: number
  onEdit: (step: number) => void
}

function ReviewItem({ icon: Icon, label, value, step, onEdit }: ReviewItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="font-medium text-foreground">{value}</div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(step)}
        className="text-muted-foreground hover:text-foreground"
      >
        <Edit3 className="w-4 h-4" />
      </Button>
    </div>
  )
}

export function StepReview() {
  const { formData, setCurrentStep } = usePublish()

  const formattedDate = formData.date 
    ? format(parseISO(formData.date), "EEEE, d 'de' MMMM", { locale: ptBR })
    : ''

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground">{PUBLISH.step7.title}</h2>
        <p className="text-muted-foreground mt-1">{PUBLISH.step7.subtitle}</p>
      </div>

      <div className="space-y-3">
        {/* Origem */}
        <ReviewItem
          icon={MapPin}
          label="Saindo de"
          value={
            <div>
              <p>{formData.origin.city}, {formData.origin.state}</p>
              <p className="text-sm text-muted-foreground">
                {formData.origin.neighborhood} - {formData.origin.meetingPoint}
              </p>
            </div>
          }
          step={1}
          onEdit={setCurrentStep}
        />

        {/* Destino */}
        <ReviewItem
          icon={Navigation}
          label="Indo para"
          value={
            <div>
              <p>{formData.destination.city}, {formData.destination.state}</p>
              <p className="text-sm text-muted-foreground">
                {formData.destination.neighborhood} - {formData.destination.dropOffPoint}
              </p>
            </div>
          }
          step={2}
          onEdit={setCurrentStep}
        />

        {/* Data e Hora */}
        <ReviewItem
          icon={CalendarDays}
          label="Data e horario"
          value={
            <div className="flex items-center gap-2">
              <span className="capitalize">{formattedDate}</span>
              <span className="text-muted-foreground">as</span>
              <span className="font-mono">{formData.time}</span>
            </div>
          }
          step={3}
          onEdit={setCurrentStep}
        />

        {/* Veiculo */}
        <ReviewItem
          icon={Car}
          label="Veiculo"
          value={
            <div className="flex items-center gap-2">
              <span>{formData.carModel}</span>
              <span className="text-muted-foreground">-</span>
              <span>{formData.carColor}</span>
            </div>
          }
          step={4}
          onEdit={setCurrentStep}
        />

        {/* Vagas */}
        <ReviewItem
          icon={Users}
          label="Vagas disponiveis"
          value={`${formData.availableSeats} ${formData.availableSeats === 1 ? 'vaga' : 'vagas'}`}
          step={4}
          onEdit={setCurrentStep}
        />

        {/* Preco */}
        <ReviewItem
          icon={DollarSign}
          label="Preco por passageiro"
          value={
            <div>
              <span className="text-lg font-mono tabular-nums">{formatPrice(formData.price)}</span>
              <span className="text-sm text-muted-foreground ml-2">
                (ganho total: {formatPrice(formData.price * formData.availableSeats)})
              </span>
            </div>
          }
          step={5}
          onEdit={setCurrentStep}
        />
      </div>

      {/* Confortos */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-foreground">Preferencias</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(6)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
            formData.allowsPets ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <PawPrint className="w-3.5 h-3.5" />
            {formData.allowsPets ? 'Pets ok' : 'Sem pets'}
          </span>
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
            formData.allowsSmoking ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <Cigarette className="w-3.5 h-3.5" />
            {formData.allowsSmoking ? 'Pode fumar' : 'Nao fumar'}
          </span>
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
            formData.allowsLuggage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <Luggage className="w-3.5 h-3.5" />
            {formData.allowsLuggage ? 'Bagagem ok' : 'Sem bagagem'}
          </span>
        </div>
      </div>

      {/* Descricao */}
      {formData.description && (
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Sua mensagem</p>
          <p className="text-foreground">{formData.description}</p>
        </div>
      )}

      {/* Aviso */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
        <p className="text-sm text-foreground">
          {PUBLISH.success.message}
        </p>
      </div>
    </div>
  )
}
