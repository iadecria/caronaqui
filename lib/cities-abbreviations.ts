/**
 * Abreviacoes de cidades e pontos de referencia da Via Dutra
 * 
 * Este arquivo contem mapeamentos de abreviacoes comuns para nomes completos,
 * facilitando a busca e autocomplete no app.
 * 
 * Estrutura preparada para expansao futura:
 * - Adicione novas cidades em CITIES_VIA_DUTRA
 * - Adicione novos pontos de referencia em LANDMARKS
 * - Adicione novas abreviacoes em ABBREVIATIONS
 * 
 * Ordem geografica: Sao Paulo -> Rio de Janeiro (km 0 a km 402)
 */

// ============================================================================
// CIDADES DA VIA DUTRA (ordem geografica SP -> RJ)
// ============================================================================

export interface CityInfo {
  name: string
  state: 'SP' | 'RJ'
  abbreviations: string[]
  km: number // km aproximado na Dutra
  popular?: boolean // cidades mais buscadas
}

export const CITIES_VIA_DUTRA: CityInfo[] = [
  // === SAO PAULO ===
  {
    name: 'Sao Paulo',
    state: 'SP',
    abbreviations: ['SP', 'Sampa', 'SPO', 'S Paulo', 'SaoPaulo'],
    km: 0,
    popular: true
  },
  {
    name: 'Guarulhos',
    state: 'SP',
    abbreviations: ['GRU', 'Gru', 'Guarulho'],
    km: 15,
    popular: true
  },
  {
    name: 'Aruja',
    state: 'SP',
    abbreviations: ['Arj'],
    km: 35
  },
  {
    name: 'Santa Isabel',
    state: 'SP',
    abbreviations: ['Sta Isabel', 'S Isabel'],
    km: 45
  },
  {
    name: 'Jacarei',
    state: 'SP',
    abbreviations: ['Jac', 'Jacareí'],
    km: 75,
    popular: true
  },
  {
    name: 'Sao Jose dos Campos',
    state: 'SP',
    abbreviations: ['SJC', 'S Jose', 'Sao Jose', 'SJ Campos', 'S J Campos', 'SJDC'],
    km: 90,
    popular: true
  },
  {
    name: 'Cacapava',
    state: 'SP',
    abbreviations: ['Caca', 'Caça', 'Cacapava'],
    km: 110
  },
  {
    name: 'Taubate',
    state: 'SP',
    abbreviations: ['Tau', 'Tauba', 'Taubaté'],
    km: 125,
    popular: true
  },
  {
    name: 'Tremembe',
    state: 'SP',
    abbreviations: ['Trem', 'Tremembé'],
    km: 135
  },
  {
    name: 'Pindamonhangaba',
    state: 'SP',
    abbreviations: ['Pinda', 'Pindá', 'Pindamonha'],
    km: 145,
    popular: true
  },
  {
    name: 'Roseira',
    state: 'SP',
    abbreviations: ['Ros'],
    km: 160
  },
  {
    name: 'Aparecida',
    state: 'SP',
    abbreviations: ['Apa', 'Aparecida do Norte', 'Santuario'],
    km: 170,
    popular: true
  },
  {
    name: 'Guaratingueta',
    state: 'SP',
    abbreviations: ['Guara', 'Guaratinguetá', 'Gtá'],
    km: 180
  },
  {
    name: 'Lorena',
    state: 'SP',
    abbreviations: ['Lor'],
    km: 195
  },
  {
    name: 'Cachoeira Paulista',
    state: 'SP',
    abbreviations: ['Cachoeira', 'C Paulista', 'CP'],
    km: 210
  },
  {
    name: 'Cruzeiro',
    state: 'SP',
    abbreviations: ['Cruz', 'Cruzeiro SP'],
    km: 225
  },
  {
    name: 'Lavrinhas',
    state: 'SP',
    abbreviations: ['Lav'],
    km: 235
  },
  {
    name: 'Queluz',
    state: 'SP',
    abbreviations: ['Quel', 'Queluz SP'],
    km: 245
  },

  // === RIO DE JANEIRO ===
  {
    name: 'Resende',
    state: 'RJ',
    abbreviations: ['Res', 'Resende RJ'],
    km: 300,
    popular: true
  },
  {
    name: 'Itatiaia',
    state: 'RJ',
    abbreviations: ['Ita', 'Itatiaia RJ'],
    km: 310
  },
  {
    name: 'Penedo',
    state: 'RJ',
    abbreviations: ['Pen', 'Penedo RJ'],
    km: 315
  },
  {
    name: 'Porto Real',
    state: 'RJ',
    abbreviations: ['PR', 'P Real'],
    km: 320
  },
  {
    name: 'Barra Mansa',
    state: 'RJ',
    abbreviations: ['BM', 'B Mansa', 'Barra'],
    km: 340,
    popular: true
  },
  {
    name: 'Volta Redonda',
    state: 'RJ',
    abbreviations: ['VR', 'V Redonda', 'Volta', 'Redonda'],
    km: 350,
    popular: true
  },
  {
    name: 'Barra do Pirai',
    state: 'RJ',
    abbreviations: ['BP', 'B Pirai', 'Barra Pirai'],
    km: 365
  },
  {
    name: 'Piraí',
    state: 'RJ',
    abbreviations: ['Pir', 'Pirai'],
    km: 370
  },
  {
    name: 'Seropedica',
    state: 'RJ',
    abbreviations: ['Sero', 'Seropédica'],
    km: 385
  },
  {
    name: 'Nova Iguacu',
    state: 'RJ',
    abbreviations: ['NI', 'N Iguacu', 'Nova Iguaçu'],
    km: 390
  },
  {
    name: 'Duque de Caxias',
    state: 'RJ',
    abbreviations: ['DC', 'Caxias', 'D Caxias', 'Duque'],
    km: 395
  },
  {
    name: 'Rio de Janeiro',
    state: 'RJ',
    abbreviations: ['RJ', 'Rio', 'RIO', 'R Janeiro', 'RioJan'],
    km: 402,
    popular: true
  },
  {
    name: 'Niteroi',
    state: 'RJ',
    abbreviations: ['Nit', 'Niterói'],
    km: 420, // via ponte
    popular: true
  }
]

// ============================================================================
// PONTOS DE REFERENCIA / LANDMARKS
// ============================================================================

export interface LandmarkInfo {
  name: string
  abbreviations: string[]
  city: string
  state: 'SP' | 'RJ'
  type: 'rodoviaria' | 'shopping' | 'posto' | 'pedagio' | 'aeroporto' | 'praca' | 'terminal' | 'universidade' | 'outro'
  description?: string
}

export const LANDMARKS: LandmarkInfo[] = [
  // === SAO PAULO ===
  {
    name: 'Rodoviaria Tiete',
    abbreviations: ['Tiete', 'Tietê', 'Rod Tiete', 'Terminal Tiete'],
    city: 'Sao Paulo',
    state: 'SP',
    type: 'rodoviaria',
    description: 'Principal rodoviaria de SP'
  },
  {
    name: 'Rodoviaria Barra Funda',
    abbreviations: ['Barra Funda', 'BF', 'Rod BF'],
    city: 'Sao Paulo',
    state: 'SP',
    type: 'rodoviaria'
  },
  {
    name: 'Aeroporto de Guarulhos',
    abbreviations: ['GRU Airport', 'Cumbica', 'Aeroporto GRU', 'GRU'],
    city: 'Guarulhos',
    state: 'SP',
    type: 'aeroporto'
  },
  {
    name: 'Shopping Jacarei',
    abbreviations: ['Shop Jac', 'Shopping Jac'],
    city: 'Jacarei',
    state: 'SP',
    type: 'shopping'
  },
  
  // === SJC ===
  {
    name: 'Rodoviaria de SJC',
    abbreviations: ['Rod SJC', 'Rodoviaria SJC', 'Rod S Jose'],
    city: 'Sao Jose dos Campos',
    state: 'SP',
    type: 'rodoviaria'
  },
  {
    name: 'Shopping Vale Sul',
    abbreviations: ['Vale Sul', 'VS', 'Shop Vale Sul'],
    city: 'Sao Jose dos Campos',
    state: 'SP',
    type: 'shopping',
    description: 'Shopping no centro de SJC'
  },
  {
    name: 'Shopping Colinas',
    abbreviations: ['Colinas', 'Shop Colinas'],
    city: 'Sao Jose dos Campos',
    state: 'SP',
    type: 'shopping'
  },
  {
    name: 'CenterVale Shopping',
    abbreviations: ['CenterVale', 'Center Vale', 'CV', 'CenterVale SJC'],
    city: 'Sao Jose dos Campos',
    state: 'SP',
    type: 'shopping',
    description: 'Shopping proximo a Dutra'
  },
  {
    name: 'CTA',
    abbreviations: ['CTA', 'Centro Tecnico Aeronautico'],
    city: 'Sao Jose dos Campos',
    state: 'SP',
    type: 'outro',
    description: 'Centro Tecnico Aeroespacial'
  },
  {
    name: 'INPE',
    abbreviations: ['INPE', 'Instituto Espacial'],
    city: 'Sao Jose dos Campos',
    state: 'SP',
    type: 'outro'
  },
  {
    name: 'Praca Afonso Pena',
    abbreviations: ['Afonso Pena', 'Pça Afonso Pena', 'AP', 'Praca AP'],
    city: 'Sao Jose dos Campos',
    state: 'SP',
    type: 'praca',
    description: 'Praca central de SJC'
  },
  {
    name: 'Aquarius',
    abbreviations: ['Aquarius', 'Jd Aquarius', 'Jardim Aquarius'],
    city: 'Sao Jose dos Campos',
    state: 'SP',
    type: 'outro',
    description: 'Bairro nobre de SJC'
  },
  {
    name: 'UNIVAP',
    abbreviations: ['Univap', 'Universidade Vale do Paraiba'],
    city: 'Sao Jose dos Campos',
    state: 'SP',
    type: 'universidade'
  },
  {
    name: 'Havan SJC',
    abbreviations: ['Havan SJC', 'Havan S Jose', 'Havan Campos'],
    city: 'Sao Jose dos Campos',
    state: 'SP',
    type: 'shopping',
    description: 'Loja Havan na Dutra'
  },
  
  // === TAUBATE ===
  {
    name: 'Rodoviaria de Taubate',
    abbreviations: ['Rod Tau', 'Rodoviaria Tau', 'Rod Taubate'],
    city: 'Taubate',
    state: 'SP',
    type: 'rodoviaria'
  },
  {
    name: 'Taubate Shopping',
    abbreviations: ['Shop Tau', 'TS', 'Taubate Shop'],
    city: 'Taubate',
    state: 'SP',
    type: 'shopping'
  },
  {
    name: 'PetroVal Taubate',
    abbreviations: ['PetroVal', 'Petroval Tau', 'Posto PetroVal', 'PetroVal Taubate'],
    city: 'Taubate',
    state: 'SP',
    type: 'posto',
    description: 'Posto de combustivel na Dutra'
  },
  {
    name: 'UNITAU',
    abbreviations: ['Unitau', 'Universidade Taubate'],
    city: 'Taubate',
    state: 'SP',
    type: 'universidade'
  },
  {
    name: 'Centro de Taubate',
    abbreviations: ['Centro Tau', 'Centro Taubate', 'Praca Santa Terezinha'],
    city: 'Taubate',
    state: 'SP',
    type: 'praca',
    description: 'Centro historico de Taubate'
  },
  
  // === GUARATINGUETA ===
  {
    name: 'Rodoviaria de Guaratingueta',
    abbreviations: ['Rod Guara', 'Rodoviaria Guara', 'Rod Guaratingueta'],
    city: 'Guaratingueta',
    state: 'SP',
    type: 'rodoviaria'
  },
  {
    name: 'Shopping Patio Guara',
    abbreviations: ['Patio Guara', 'Shop Guara', 'Patio Guaratingueta'],
    city: 'Guaratingueta',
    state: 'SP',
    type: 'shopping'
  },
  
  // === LORENA ===
  {
    name: 'Rodoviaria de Lorena',
    abbreviations: ['Rod Lor', 'Rodoviaria Lor', 'Rod Lorena'],
    city: 'Lorena',
    state: 'SP',
    type: 'rodoviaria'
  },
  {
    name: 'Havan Lorena',
    abbreviations: ['Havan Lor', 'Havan Lorena'],
    city: 'Lorena',
    state: 'SP',
    type: 'shopping',
    description: 'Loja Havan na Dutra em Lorena'
  },
  {
    name: 'Centro de Lorena',
    abbreviations: ['Centro Lor', 'Centro Lorena', 'Praca Dr Arnolfo'],
    city: 'Lorena',
    state: 'SP',
    type: 'praca'
  },
  
  // === APARECIDA ===
  {
    name: 'Santuario Nacional de Aparecida',
    abbreviations: ['Santuario', 'Basilica', 'Nossa Senhora Aparecida', 'NSA'],
    city: 'Aparecida',
    state: 'SP',
    type: 'outro',
    description: 'Maior santuario mariano do mundo'
  },
  {
    name: 'Rodoviaria de Aparecida',
    abbreviations: ['Rod Apa', 'Rodoviaria Aparecida'],
    city: 'Aparecida',
    state: 'SP',
    type: 'rodoviaria'
  },
  
  // === PEDAGIOS ===
  {
    name: 'Pedagio de Aruja',
    abbreviations: ['Ped Aruja', 'Pedagio Arj'],
    city: 'Aruja',
    state: 'SP',
    type: 'pedagio'
  },
  {
    name: 'Pedagio de Jacarei',
    abbreviations: ['Ped Jac', 'Pedagio Jac'],
    city: 'Jacarei',
    state: 'SP',
    type: 'pedagio'
  },
  {
    name: 'Pedagio de Moreira Cesar',
    abbreviations: ['Ped MC', 'Moreira Cesar'],
    city: 'Pindamonhangaba',
    state: 'SP',
    type: 'pedagio'
  },
  {
    name: 'Pedagio de Queluz',
    abbreviations: ['Ped Queluz', 'Pedagio Quel'],
    city: 'Queluz',
    state: 'SP',
    type: 'pedagio'
  },
  
  // === RIO DE JANEIRO ===
  {
    name: 'Rodoviaria Novo Rio',
    abbreviations: ['Novo Rio', 'NR', 'Rod NR', 'Rodoviaria RJ'],
    city: 'Rio de Janeiro',
    state: 'RJ',
    type: 'rodoviaria',
    description: 'Principal rodoviaria do RJ'
  },
  {
    name: 'Aeroporto Galeao',
    abbreviations: ['Galeao', 'GIG', 'Aeroporto GIG', 'Antonio Carlos Jobim'],
    city: 'Rio de Janeiro',
    state: 'RJ',
    type: 'aeroporto'
  },
  {
    name: 'Aeroporto Santos Dumont',
    abbreviations: ['Santos Dumont', 'SDU', 'Aeroporto SDU'],
    city: 'Rio de Janeiro',
    state: 'RJ',
    type: 'aeroporto'
  },
  {
    name: 'Shopping Nova America',
    abbreviations: ['Nova America', 'Shop NA'],
    city: 'Rio de Janeiro',
    state: 'RJ',
    type: 'shopping'
  },
  {
    name: 'Norte Shopping',
    abbreviations: ['Norte Shop', 'NS'],
    city: 'Rio de Janeiro',
    state: 'RJ',
    type: 'shopping'
  },
  {
    name: 'Barra Shopping',
    abbreviations: ['Barra Shop', 'BS', 'Shopping Barra'],
    city: 'Rio de Janeiro',
    state: 'RJ',
    type: 'shopping'
  },
  
  // === VOLTA REDONDA / BARRA MANSA ===
  {
    name: 'Rodoviaria de Volta Redonda',
    abbreviations: ['Rod VR', 'Rodoviaria VR'],
    city: 'Volta Redonda',
    state: 'RJ',
    type: 'rodoviaria'
  },
  {
    name: 'Sider Shopping',
    abbreviations: ['Sider', 'Sider Shop'],
    city: 'Volta Redonda',
    state: 'RJ',
    type: 'shopping'
  },
  
  // === RESENDE ===
  {
    name: 'Rodoviaria de Resende',
    abbreviations: ['Rod Res', 'Rodoviaria Resende'],
    city: 'Resende',
    state: 'RJ',
    type: 'rodoviaria'
  },
  {
    name: 'AMAN',
    abbreviations: ['AMAN', 'Academia Militar'],
    city: 'Resende',
    state: 'RJ',
    type: 'outro',
    description: 'Academia Militar das Agulhas Negras'
  }
]

// ============================================================================
// MAPEAMENTO RAPIDO DE ABREVIACOES
// ============================================================================

// Gera um mapa de abreviacao -> cidade para busca rapida
export function buildAbbreviationMap(): Map<string, CityInfo> {
  const map = new Map<string, CityInfo>()
  
  for (const city of CITIES_VIA_DUTRA) {
    // Adiciona o nome completo (lowercase)
    map.set(city.name.toLowerCase(), city)
    
    // Adiciona cada abreviacao
    for (const abbr of city.abbreviations) {
      map.set(abbr.toLowerCase(), city)
    }
  }
  
  return map
}

// Gera um mapa de abreviacao -> landmark para busca rapida
export function buildLandmarkMap(): Map<string, LandmarkInfo> {
  const map = new Map<string, LandmarkInfo>()
  
  for (const landmark of LANDMARKS) {
    // Adiciona o nome completo (lowercase)
    map.set(landmark.name.toLowerCase(), landmark)
    
    // Adiciona cada abreviacao
    for (const abbr of landmark.abbreviations) {
      map.set(abbr.toLowerCase(), landmark)
    }
  }
  
  return map
}

// Cache dos mapas
let cityAbbreviationMap: Map<string, CityInfo> | null = null
let landmarkAbbreviationMap: Map<string, LandmarkInfo> | null = null

/**
 * Busca uma cidade por nome ou abreviacao
 */
export function findCity(query: string): CityInfo | undefined {
  if (!cityAbbreviationMap) {
    cityAbbreviationMap = buildAbbreviationMap()
  }
  return cityAbbreviationMap.get(query.toLowerCase())
}

/**
 * Busca um ponto de referencia por nome ou abreviacao
 */
export function findLandmark(query: string): LandmarkInfo | undefined {
  if (!landmarkAbbreviationMap) {
    landmarkAbbreviationMap = buildLandmarkMap()
  }
  return landmarkAbbreviationMap.get(query.toLowerCase())
}

/**
 * Normaliza string removendo acentos e caracteres especiais
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s]/g, '') // remove caracteres especiais
    .trim()
}

/**
 * Calcula score de fuzzy match entre query e target
 * Retorna um numero entre 0 (sem match) e 100 (match perfeito)
 */
function fuzzyScore(query: string, target: string): number {
  const q = normalizeString(query)
  const t = normalizeString(target)
  
  if (!q || !t) return 0
  
  // Match exato
  if (q === t) return 100
  
  // Target comeca com query (ex: "taub" -> "taubate")
  if (t.startsWith(q)) return 90 + (q.length / t.length) * 10
  
  // Query comeca com target (ex: "taubate" -> "tau")
  if (q.startsWith(t)) return 80 + (t.length / q.length) * 10
  
  // Target contem query
  if (t.includes(q)) return 70 + (q.length / t.length) * 10
  
  // Query contem target
  if (q.includes(t)) return 60 + (t.length / q.length) * 10
  
  // Fuzzy: todas as letras da query aparecem em ordem no target
  let qIndex = 0
  let matchedChars = 0
  let consecutiveBonus = 0
  let lastMatchIndex = -1
  
  for (let i = 0; i < t.length && qIndex < q.length; i++) {
    if (t[i] === q[qIndex]) {
      matchedChars++
      // Bonus para caracteres consecutivos
      if (lastMatchIndex === i - 1) {
        consecutiveBonus += 5
      }
      lastMatchIndex = i
      qIndex++
    }
  }
  
  if (qIndex === q.length) {
    // Todas as letras foram encontradas em ordem
    const baseScore = 40 + (matchedChars / t.length) * 20 + consecutiveBonus
    return Math.min(baseScore, 65)
  }
  
  // Levenshtein distance simplificado para queries curtas
  if (q.length <= 5 && t.length <= 15) {
    const distance = levenshteinDistance(q, t)
    const maxLen = Math.max(q.length, t.length)
    const similarity = 1 - distance / maxLen
    if (similarity > 0.5) {
      return 30 + similarity * 30
    }
  }
  
  return 0
}

/**
 * Calcula distancia de Levenshtein entre duas strings
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

interface ScoredResult {
  item: CityInfo | LandmarkInfo
  score: number
}

/**
 * Busca cidades e landmarks com fuzzy matching
 */
export function searchLocations(query: string): Array<CityInfo | LandmarkInfo> {
  const q = query.trim()
  if (q.length < 2) return []
  
  const scoredResults: ScoredResult[] = []
  const seen = new Set<string>()
  
  // Busca em cidades
  for (const city of CITIES_VIA_DUTRA) {
    if (seen.has(city.name)) continue
    
    // Score do nome principal
    let bestScore = fuzzyScore(q, city.name)
    
    // Score das abreviacoes
    for (const abbr of city.abbreviations) {
      const abbrScore = fuzzyScore(q, abbr)
      if (abbrScore > bestScore) {
        bestScore = abbrScore
      }
    }
    
    // Bonus para cidades populares
    if (city.popular && bestScore > 0) {
      bestScore += 5
    }
    
    if (bestScore > 30) {
      scoredResults.push({ item: city, score: bestScore })
      seen.add(city.name)
    }
  }
  
  // Busca em landmarks
  for (const landmark of LANDMARKS) {
    if (seen.has(landmark.name)) continue
    
    // Score do nome principal
    let bestScore = fuzzyScore(q, landmark.name)
    
    // Score das abreviacoes
    for (const abbr of landmark.abbreviations) {
      const abbrScore = fuzzyScore(q, abbr)
      if (abbrScore > bestScore) {
        bestScore = abbrScore
      }
    }
    
    // Score da cidade associada
    const cityScore = fuzzyScore(q, landmark.city)
    if (cityScore > bestScore) {
      bestScore = cityScore * 0.7 // Reduz um pouco se o match foi na cidade
    }
    
    if (bestScore > 30) {
      scoredResults.push({ item: landmark, score: bestScore })
      seen.add(landmark.name)
    }
  }
  
  // Ordena por score decrescente
  scoredResults.sort((a, b) => {
    // Primeiro por score
    if (b.score !== a.score) {
      return b.score - a.score
    }
    
    // Empate: cidades antes de landmarks
    const aIsCity = isCity(a.item)
    const bIsCity = isCity(b.item)
    if (aIsCity && !bIsCity) return -1
    if (!aIsCity && bIsCity) return 1
    
    // Empate entre cidades: populares primeiro
    if (aIsCity && bIsCity) {
      const aPop = (a.item as CityInfo).popular ? 1 : 0
      const bPop = (b.item as CityInfo).popular ? 1 : 0
      if (bPop !== aPop) return bPop - aPop
      
      // Por km
      return (a.item as CityInfo).km - (b.item as CityInfo).km
    }
    
    return 0
  })
  
  return scoredResults.slice(0, 10).map(r => r.item)
}

/**
 * Retorna cidades populares para sugestoes iniciais
 */
export function getPopularCities(): CityInfo[] {
  return CITIES_VIA_DUTRA.filter(c => c.popular)
}

/**
 * Retorna cidades por estado
 */
export function getCitiesByState(state: 'SP' | 'RJ'): CityInfo[] {
  return CITIES_VIA_DUTRA.filter(c => c.state === state)
}

/**
 * Formata nome da cidade com estado
 */
export function formatCityName(city: CityInfo): string {
  return `${city.name}, ${city.state}`
}

/**
 * Formata nome do landmark com cidade
 */
export function formatLandmarkName(landmark: LandmarkInfo): string {
  return `${landmark.name} - ${landmark.city}, ${landmark.state}`
}

/**
 * Tipo helper para verificar se e cidade ou landmark
 */
export function isCity(item: CityInfo | LandmarkInfo): item is CityInfo {
  return 'km' in item
}
