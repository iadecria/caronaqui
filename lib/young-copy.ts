/**
 * Textos descontraídos e gírias para o app CaronAqui
 * Sistema de frases que alternam na tela inicial
 */

export const heroTaglines = [
  'Bora dividir a estrada (e a grana)?',
  'Encontra alguém que tá indo pro mesmo lugar que você',
  'Carona que faz sentido, tipo mesmo',
  'Conhece aquele amigo que tá de carro vazio? A gente conecta vocês',
  'Viajar de boa é tipo encontrar um soulmate',
  'Split real: você paga menos, o motorista ganha mais',
  'Caronas de gente pra gente, sem aplicativo no meio',
  'Sai desse "por que não pedir carona pro vizinho?" e pede',
  'A estrada é melhor com companhia (e com grana no bolso)',
  'Carona que começa em ódio de trânsito e termina em amizade',
  'Viaja de boa, sem aquele sentimento de tá pagando taxa pro banco',
  'Conhece alguém que tá saindo? Bora dividir!',
]

export const priceWarnings = {
  normal: 'Preço justo, sem blefar',
  high: 'Ó, alguém ta com pressa (ou carro de luxo)',
  veryHigh: 'Parece que o motorista tá viajando em foguete também',
  cheap: 'Tá de promoção? Aproveita rápido!',
}

export const rideDescriptions = [
  'Vibe top, sem lacração',
  'Motorista chill, papo reto',
  'Viagem tranquila, só falta o cafezinho',
  'Ar ligado, vibe gelada',
  'Carona com grana',
  'Sem stress, só sucesso',
  'Viagem blindada, sem treta',
  'Motorista top, conversa de qualidade',
  'Carona checada, vibe aprovada',
]

export const emptyStateMessages = [
  'Nada por enquanto, mas em breve tem novidade',
  'As caronas estão tímidas hoje',
  'Não achou? A gente também não, relaxa',
  'Carona que você procura tá em outro lugar',
  'Tá vazio aqui, mas tá beleza',
]

export const noResultsMessages = [
  'Ops, ninguém tá saindo daí no momento',
  'Nenhuma carona te chamou? Cria uma que alguém vem com você',
  'Tá ruim nessa rota agora, tenta outra vibe',
  'Vazio demais por aqui, seja pioneiro',
]

export const priceComments = {
  belowAverage: 'Carona de verdade, sem roubo',
  average: 'Preço na medida certa',
  aboveAverage: 'Tá caro, mas confortável demais pro seu bem',
  expensive: 'Meu deus, é ouro esse trajeto?',
  veryExpensive: 'Relaxa Bill Gates, tem opções mais em conta',
}

export const getRandomHeroTagline = () => {
  return heroTaglines[Math.floor(Math.random() * heroTaglines.length)]
}

export const getRandomRideDescription = () => {
  return rideDescriptions[Math.floor(Math.random() * rideDescriptions.length)]
}

export const getRandomEmptyState = () => {
  return emptyStateMessages[Math.floor(Math.random() * emptyStateMessages.length)]
}

export const getPriceComment = (price: number, averagePrice: number): string => {
  const ratio = price / averagePrice
  
  if (ratio < 0.85) return priceComments.belowAverage
  if (ratio <= 1.1) return priceComments.average
  if (ratio <= 1.3) return priceComments.aboveAverage
  if (ratio <= 1.6) return priceComments.expensive
  return priceComments.veryExpensive
}
