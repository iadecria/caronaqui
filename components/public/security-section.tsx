import { ShieldCheckIcon, UserCheckIcon, MessageSquareIcon, StarIcon, PhoneIcon, BadgeCheckIcon } from 'lucide-react'

const features = [
  {
    icon: UserCheckIcon,
    title: 'Perfis verificados',
    description: 'Todos os motoristas passam por verificacao de identidade e telefone.'
  },
  {
    icon: StarIcon,
    title: 'Sistema de avaliacoes',
    description: 'Veja as avaliacoes de outros passageiros antes de reservar.'
  },
  {
    icon: MessageSquareIcon,
    title: 'Chat integrado',
    description: 'Converse com o motorista antes da viagem para tirar duvidas.'
  },
  {
    icon: PhoneIcon,
    title: 'Contato verificado',
    description: 'Todos os usuarios tem telefone verificado para sua seguranca.'
  },
  {
    icon: BadgeCheckIcon,
    title: 'Historico de viagens',
    description: 'Acompanhe o historico completo de viagens de cada motorista.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Suporte 24h',
    description: 'Nossa equipe esta disponivel para ajudar a qualquer momento.'
  }
]

export function SecuritySection() {
  return (
    <section id="seguranca" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <ShieldCheckIcon className="h-4 w-4" />
              Seguranca em primeiro lugar
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Viaje com tranquilidade
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              O CaronAqui foi criado pensando na sua seguranca. 
              Implementamos diversas camadas de verificacao para garantir que 
              sua experiencia seja a melhor possivel.
            </p>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <ShieldCheckIcon className="h-12 w-12 text-primary" />
                </div>
                <p className="text-4xl font-bold text-foreground mb-2 font-mono">99.8%</p>
                <p className="text-muted-foreground">Viagens concluidas com sucesso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
