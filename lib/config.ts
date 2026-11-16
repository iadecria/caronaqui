// Configuracoes de ambiente do frontend

// Em Next.js, apenas variaveis NEXT_PUBLIC_* ficam disponiveis no client.
// Precisa ser referenciada de forma literal para o bundler substituir o valor.
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
