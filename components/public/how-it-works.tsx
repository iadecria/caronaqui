import { SearchIcon, MessageCircleIcon, CarIcon, StarIcon } from 'lucide-react'

const steps = [
  {
    icon: SearchIcon,
    title: 'Busque sua carona',
    description: 'Informe origem, destino e data. Veja todas as opcoes disponiveis com precos e horarios.'
  },
  {
    icon: MessageCircleIcon,
    title: 'Entre em contato',
    description: 'Converse com o motorista, tire duvidas e combine os detalhes da viagem.'
  },
  {
    icon: CarIcon,
    title: 'Viaje com conforto',
    description: 'Encontre o motorista no ponto combinado e aproveite a viagem com seguranca.'
  },
  {
    icon: StarIcon,
    title: 'Avalie a experiencia',
    description: 'Apos a viagem, avalie o motorista e ajude a comunidade a crescer.'
  }
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Como funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Em poucos passos voce encontra a carona perfeita para sua viagem
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}
              
              <div className="flex flex-col items-center text-center">
                {/* Step number */}
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
