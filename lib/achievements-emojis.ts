/**
 * Paleta Padrão de Emojis para Conquistas
 * Design Minimalista Elegante - Monocromático com destaque em verde
 * 
 * Estilo:
 * - Cores neutras (cinza, preto, branco)
 * - Destaque apenas em verde (cor primária do app)
 * - Tipografia elegante e simples
 * - Sem cores vibrantes ou infantis
 */

export interface AchievementEmoji {
  emoji: string
  name: string
  category: 'viagem' | 'motorista' | 'passageiro' | 'comunidade' | 'milestones' | 'especial'
  color: string // Tailwind color class (monocromático)
  bgColor: string // Tailwind bg color class (monocromático)
}

/**
 * Catálogo padrão de emojis para conquistas
 * Organizados por categoria
 */
export const ACHIEVEMENT_EMOJIS = {
  // Viagens e Trajetos - Símbolos minimalistas
  viagem: {
    ponta_firme: { emoji: '◆', name: 'Ponta Firme', category: 'viagem' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    explorador: { emoji: '◈', name: 'Explorador', category: 'viagem' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    madrugador: { emoji: '●', name: 'Madrugador', category: 'viagem' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    velocista: { emoji: '▶', name: 'Velocista', category: 'viagem' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    viajante: { emoji: '▲', name: 'Viajante', category: 'viagem' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    motorista_ouro: { emoji: '█', name: 'Motorista Ouro', category: 'viagem' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
  },

  // Ratings e Confiabilidade - Verde primário como destaque
  motorista: {
    confiavel: { emoji: '◆', name: 'Confiável', category: 'motorista' as const, color: 'text-primary', bgColor: 'bg-primary/10' },
    super_host: { emoji: '★', name: 'Super Host', category: 'motorista' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    pontual: { emoji: '⊡', name: 'Pontual', category: 'motorista' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    limpo: { emoji: '◉', name: 'Limpo e Organizado', category: 'motorista' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    seguro: { emoji: '⬢', name: 'Seguro', category: 'motorista' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    musica: { emoji: '≈', name: 'DJ do Carro', category: 'motorista' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
  },

  // Economia e Passageiros - Verde para destaque
  passageiro: {
    economia_verde: { emoji: '◆', name: 'Economia Verde', category: 'passageiro' as const, color: 'text-primary', bgColor: 'bg-primary/10' },
    economista: { emoji: '◈', name: 'Economista', category: 'passageiro' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    reciclador: { emoji: '⟳', name: 'Amigo da Natureza', category: 'passageiro' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    fiador: { emoji: '◐', name: 'Fiador', category: 'passageiro' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    social: { emoji: '◬', name: 'Papo na Estrada', category: 'passageiro' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
  },

  // Comunidade - Cinza neutro
  comunidade: {
    amigo: { emoji: '◐', name: 'Amigo da Comunidade', category: 'comunidade' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    referral: { emoji: '◈', name: 'Conexões', category: 'comunidade' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    avalista: { emoji: '✓', name: 'Avaliador', category: 'comunidade' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    mentor: { emoji: '⊕', name: 'Mentor', category: 'comunidade' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    veterano: { emoji: '◊', name: 'Veterano', category: 'comunidade' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
  },

  // Milestones - Cinza com variação de intensidade
  milestones: {
    primeiro_passo: { emoji: '◦', name: '1ª Viagem', category: 'milestones' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    dez_viagens: { emoji: '▪', name: '10 Viagens', category: 'milestones' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    cinquenta_viagens: { emoji: '■', name: '50 Viagens', category: 'milestones' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    cem_viagens: { emoji: '█', name: '100 Viagens', category: 'milestones' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    quinhentas_viagens: { emoji: '▲', name: '500 Viagens', category: 'milestones' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    lenda: { emoji: '◆', name: 'Lenda da Dutra', category: 'milestones' as const, color: 'text-primary', bgColor: 'bg-primary/10' },
  },

  // Especiais/Sazonais - Apenas verde para os mais importantes
  especial: {
    novo_usuario: { emoji: '◉', name: 'Bem-vindo', category: 'especial' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    badge_ouro: { emoji: '★', name: 'Ouro Puro', category: 'especial' as const, color: 'text-primary', bgColor: 'bg-primary/10' },
    badge_prata: { emoji: '◇', name: 'Prata Esterlina', category: 'especial' as const, color: 'text-slate-600', bgColor: 'bg-slate-100' },
    badge_bronze: { emoji: '◈', name: 'Bronze Clássico', category: 'especial' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
    aniversario: { emoji: '◎', name: 'Aniversariante', category: 'especial' as const, color: 'text-slate-700', bgColor: 'bg-slate-100' },
  },
}

/**
 * Helper function para pegar emoji aleatório de uma categoria
 */
export function getRandomAchievementEmoji(category: keyof typeof ACHIEVEMENT_EMOJIS): AchievementEmoji {
  const emojis = Object.values(ACHIEVEMENT_EMOJIS[category])
  return emojis[Math.floor(Math.random() * emojis.length)]
}

/**
 * Helper function para pegar emoji específico
 */
export function getAchievementEmoji(
  category: keyof typeof ACHIEVEMENT_EMOJIS,
  key: string
): AchievementEmoji | undefined {
  const categoryEmojis = ACHIEVEMENT_EMOJIS[category] as Record<string, AchievementEmoji>
  return categoryEmojis[key]
}

/**
 * Gerar lista de emojis para diferentes tipos de conquistas
 */
export function getAllAchievementEmojis(): AchievementEmoji[] {
  return Object.values(ACHIEVEMENT_EMOJIS).flatMap(category => Object.values(category))
}

/**
 * Cores padrão para backgrounds de conquistas (minimalista)
 */
export const ACHIEVEMENT_COLORS = {
  tier1: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' }, // Comum
  tier2: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },    // Incomum
  tier3: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' }, // Raro
  tier4: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },  // Épico
  tier5: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },       // Lendário
}

/**
 * Padrão de design minimalista para exibição de conquistas
 */
export const ACHIEVEMENT_DISPLAY_STYLES = {
  badge: {
    size: 'h-12 w-12',
    emoji_size: 'text-2xl',
    border: 'border-2',
    rounded: 'rounded-full',
  },
  card: {
    size: 'h-32 w-32',
    emoji_size: 'text-6xl',
    border: 'border',
    rounded: 'rounded-xl',
  },
  compact: {
    size: 'h-10 w-10',
    emoji_size: 'text-lg',
    border: 'border',
    rounded: 'rounded-lg',
  },
}
