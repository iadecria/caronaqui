/**
 * CaronAqui - Identidade, Tom de Voz e Frases
 * 
 * REGRAS:
 * - Tom extrovertido mas não invasivo
 * - Direto e informal (fala como amigo, não empresa)
 * - Humor leve, nunca forçado
 * - Empático (viajar junto e confiança)
 * - ZERO corporatives ("prezado usuário", "conforme solicitado")
 * - ZERO emojis (apenas ícones Lucide)
 */

// Taglines principais (varia a cada carregamento)
export const TAGLINES = {
  principal: "Carona boa e que sobra vaga pra você.",
  alt1: "Sua carona, sua vibe.",
  alt2: "Menos carro, mais papo.",
  alt3: "A Via Dutra é longa. Por que ir sozinho?",
  alt4: "Carona boa começa aqui.",
  alt5: "Do Rio a SP, a gente vai junto.",
  alt6: "Gasolina cara? Divide comigo.",
  alt7: "Caronas que não quebram a grana.",
  alt8: "Viajando sem ficar na lama.",
  alt9: "Split de gasolina, não de terapia.",
  alt10: "Chegando junto, sem drama."
}

// Home / Boas-vindas
export const HOME = {
  greeting: (name: string) => `E aí, ${name}!`,
  headlines: [
    "Pra onde você tá indo hoje?",
    "Sua próxima carona tá esperando.",
    "Alguém já tá indo pro mesmo lugar que você.",
    "Bora rachar o pedágio?",
  ],
  subheadline: "Do Rio a SP, sem stress e sem gastar sozinho.",
  cta: "Carona boa e que sobra vaga pra você. Bora?",
}

// Busca
export const SEARCH = {
  withResults: (count: number) => count === 1 
    ? "Achamos quem vai pro mesmo lugar que você." 
    : `${count} caronas disponíveis. Escolhe a sua.`,
  noResults: [
    "Ninguém indo pra lá ainda... que tal publicar a sua?",
    "Parece que você vai ser o pioneiro nessa rota hoje.",
    "Essa rota tá vazia. Mas você pode mudar isso.",
    "Nenhuma carona encontrada. Tenta outro horário?"
  ],
  placeholder: {
    origin: "Saindo de...",
    destination: "Indo para...",
    date: "Quando é a viagem?"
  }
}

// Publicar carona - Steps
export const PUBLISH = {
  step0: {
    title: "Qual é o role de hoje?",
    subtitle: "Conta o trajeto pra gente."
  },
  step1: {
    title: "De onde você sai?",
    subtitle: "Informe o ponto de partida."
  },
  step2: {
    title: "Pra onde você vai?",
    subtitle: "Informe o destino da viagem."
  },
  step3: {
    title: "Quando é a viagem?",
    subtitle: "Marca o dia no calendário."
  },
  step4: {
    title: "Qual carro vai levar a galera?",
    subtitle: "Seleciona o veículo da viagem."
  },
  step5: {
    title: "Quanto você quer cobrar?",
    subtitle: "Divide justo, todo mundo ganha."
  },
  step6: {
    title: "Qual é a sua vibe de motorista?",
    subtitle: "Como é viajar com você?"
  },
  step7: {
    title: "Tudo certo! Revisa e publica.",
    subtitle: "Quase lá. Confere os dados e manda ver."
  },
  success: {
    title: "Carona publicada!",
    subtitle: "Agora é esperar a galera entrar.",
    message: "Tá no ar! Seus passageiros já podem te encontrar."
  }
}

// Termômetro de Preço
export const PRICE_INDICATOR = {
  veryLow: "Tá quase de graça. Tem certeza?",
  low: "Preço camarada. Vai lotar rápido.",
  fair: "Preço justo. Motorista feliz, passageiro feliz.",
  average: "Tá no ponto. Nem barato demais, nem salgado.",
  high: "Tá salgadinho. Mas se o carro for bom, vai.",
  veryHigh: "Uber tá mais barato. Pensa bem..."
}

// Detalhes da carona
export const RIDE_DETAILS = {
  title: "Confere o trajeto e solicita sua vaga.",
  cta: "Gostou? Garante seu lugar antes que encha.",
  bookButton: "Solicitar vaga"
}

// Booking
export const BOOKING = {
  confirm: {
    title: "Confirma os dados e bora!",
    subtitle: "Tudo certo com a viagem?"
  },
  pix: {
    title: "Paga direto pro motorista via PIX.",
    subtitle: "Copia a chave e faz o PIX. Simples assim.",
    note: "Pagamento direto, sem intermediário."
  },
  success: {
    title: "Vaga garantida! Boa viagem.",
    subtitle: "Tá confirmado. Nos vemos na estrada.",
    message: "Você tá dentro! Agora é só não perder o horário."
  }
}

// Favoritos
export const FAVORITES = {
  title: "Seus motoristas favoritos ficam aqui.",
  empty: "Motorista bom merece uma segunda carona.",
  cta: "Guarda quem você curtiu viajar junto."
}

// Notificações
export const NOTIFICATIONS = {
  confirmed: "Sua vaga foi confirmada pelo motorista.",
  departed: "O motorista saiu. Tá a caminho!",
  arriving: "Faltam 15 minutos. Já pode ver a placa do carro.",
  completed: "Viagem concluída. Que tal avaliar?",
  newPassenger: "Novo passageiro solicitou sua carona.",
  cancelled: "Passageiro cancelou a vaga.",
  empty: "Nenhuma notificação. Tudo tranquilo por aqui."
}

// Avaliação
export const RATING = {
  title: "Como foi a viagem?",
  subtitle: "Conta como foi o role.",
  cta: "Sua avaliação ajuda todo mundo."
}

// Perfil
export const PROFILE = {
  verified: "Documentos verificados. Passageiros confiam mais em você.",
  noReviews: "Ainda sem avaliações. Sua primeira carona vai mudar isso.",
  edit: "Editar perfil"
}

// Erros e estados vazios
export const ERRORS = {
  generic: "Algo deu errado. Tenta de novo?",
  network: "Não conseguimos carregar. Verifica sua conexão.",
  unexpected: "Ops. Isso não era pra acontecer.",
  offline: "Sem internet? A estrada espera, mas o app não."
}

// Cancelamento
export const CANCEL = {
  warning: "Vai cancelar? O passageiro vai ficar sabendo.",
  confirm: "Tem certeza que quer cancelar?",
  success: "Cancelamento registrado. Avisa com antecedência da próxima vez."
}

// Onboarding
export const ONBOARDING = [
  "Bem-vindo ao CaronAqui. Aqui você divide a estrada com quem vai pro mesmo lugar.",
  "Motorista ou passageiro? Você decide. Às vezes os dois.",
  "Caronas do Rio a SP pela Via Dutra. Simples, direto, sem frescura.",
  "Cria seu perfil, publica ou busca uma carona. É isso."
]

// Microcopy (botões e labels)
export const LABELS = {
  searchRide: "Buscar carona",
  publishRide: "Publicar carona",
  requestSeat: "Solicitar vaga",
  confirm: "Confirmar",
  cancel: "Cancelar",
  copyPix: "Copiar chave PIX",
  favoriteDriver: "Favoritar motorista",
  report: "Denunciar",
  next: "Próximo",
  back: "Voltar",
  publishNow: "Publicar agora",
  availableSeats: "vagas disponíveis",
  verified: "Verificado",
  reviews: "avaliações",
  seeAll: "Ver todas",
  viewDetails: "Ver detalhes"
}

// Cidades da Via Dutra (ordem SP -> Rio)
export const CITIES = {
  sp: [
    "São Paulo",
    "Guarulhos",
    "Jacareí",
    "São José dos Campos",
    "Caçapava",
    "Taubaté",
    "Pindamonhangaba",
    "Guaratinguetá",
    "Lorena",
    "Aparecida",
    "Cruzeiro"
  ],
  rj: [
    "Rio de Janeiro",
    "Niterói",
    "Duque de Caxias",
    "Resende",
    "Itatiaia",
    "Volta Redonda",
    "Barra Mansa"
  ],
  landmarks: [
    "Rodoviária Tietê (SP)",
    "Shopping Vale Sul (SJC)",
    "Santuário de Aparecida",
    "Pedágio de Queluz",
    "Rodoviária Novo Rio"
  ]
}

// Função helper para pegar frase aleatória
export function getRandomPhrase(phrases: string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)]
}

// Função helper para indicador de preço
export function getPriceIndicatorText(price: number, avgPrice: number): string {
  const diff = price - avgPrice
  const percentage = (diff / avgPrice) * 100

  if (percentage < -30) return PRICE_INDICATOR.veryLow
  if (percentage < -10) return PRICE_INDICATOR.low
  if (percentage >= -10 && percentage <= 10) return PRICE_INDICATOR.fair
  if (percentage > 10 && percentage <= 25) return PRICE_INDICATOR.average
  if (percentage > 25 && percentage <= 50) return PRICE_INDICATOR.high
  return PRICE_INDICATOR.veryHigh
}
