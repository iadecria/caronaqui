// Camada de integracao com o backend Laravel.
// Os tipos publicos vem de @/lib/types (camelCase). O backend responde em
// snake_case, entao convertemos as chaves na fronteira via snakeToCamel.

import type {
  Booking,
  Conversation,
  CreateBookingData,
  CreateRideData,
  Message,
  Notification,
  PaginationMeta,
  PendingReview,
  PopularRoute,
  Review,
  Ride,
  RideFilters,
  UserProfile,
} from '@/lib/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Tipos de erro da API
export class ApiError extends Error {
  status: number
  data: Record<string, unknown>

  constructor(message: string, status: number, data: Record<string, unknown> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Converte recursivamente chaves snake_case para camelCase
function snakeToCamel(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(snakeToCamel)
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      const camelKey = key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase())
      out[camelKey] = snakeToCamel(val)
    }
    return out
  }
  return value
}

// Converte recursivamente chaves camelCase para snake_case (para envios)
function camelToSnake(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(camelToSnake)
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
      out[snakeKey] = camelToSnake(val)
    }
    return out
  }
  return value
}

// Funcao base para chamadas API
export async function api<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('caronaqui_token') : null

  const isFormData = options?.body instanceof FormData

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  if (token && !options?.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers as Record<string, string> | undefined),
    },
  })

  const raw = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      (raw as { message?: string }).message || response.statusText,
      response.status,
      raw as Record<string, unknown>
    )
  }

  return snakeToCamel(raw) as T
}

// ============================================
// AUTENTICACAO
// ============================================

export interface LoginResponse {
  user: UserProfile
  token: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  phone?: string
}

export const authApi = {
  login: (email: string, password: string) =>
    api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),

  register: (data: RegisterData) =>
    api<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(camelToSnake(data)),
      skipAuth: true,
    }),

  logout: () =>
    api<{ message: string }>('/auth/logout', { method: 'POST' }),

  me: () =>
    api<{ user: UserProfile }>('/auth/me'),

  refresh: () =>
    api<{ token: string }>('/auth/refresh', { method: 'POST' }),
}

// ============================================
// CARONAS
// ============================================

export const ridesApi = {
  list: (filters?: RideFilters) => {
    const params = new URLSearchParams()
    if (filters) {
      if (filters.originCity) params.append('origin_city', filters.originCity)
      if (filters.destinationCity) params.append('destination_city', filters.destinationCity)
      if (filters.date) params.append('date', filters.date)
      if (filters.seats !== undefined) params.append('seats', String(filters.seats))
      if (filters.maxPrice !== undefined) params.append('max_price', String(filters.maxPrice))
      if (filters.allowsPets !== undefined) params.append('allows_pets', String(filters.allowsPets))
      if (filters.ladiesOnly !== undefined) params.append('ladies_only', String(filters.ladiesOnly))
    }
    const query = params.toString()
    return api<{ data: Ride[]; meta: PaginationMeta }>(`/rides${query ? `?${query}` : ''}`)
  },

  get: (id: string) =>
    api<{ data: Ride }>(`/rides/${id}`),

  create: (data: CreateRideData) =>
    api<{ data: Ride }>('/rides', {
      method: 'POST',
      body: JSON.stringify(camelToSnake(data)),
    }),

  update: (id: string, data: Partial<CreateRideData>) =>
    api<{ data: Ride }>(`/rides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(camelToSnake(data)),
    }),

  cancel: (id: string) =>
    api<{ message: string }>(`/rides/${id}`, { method: 'DELETE' }),

  myRides: () =>
    api<{ data: Ride[] }>('/rides/my'),

  popularRoutes: () =>
    api<{ data: PopularRoute[] }>('/rides/popular-routes'),
}

// ============================================
// RESERVAS
// ============================================

export const bookingsApi = {
  list: () =>
    api<{ data: Booking[] }>('/bookings'),

  get: (id: string) =>
    api<{ data: Booking }>(`/bookings/${id}`),

  create: (data: CreateBookingData) =>
    api<{ data: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(camelToSnake(data)),
    }),

  confirm: (id: string) =>
    api<{ data: Booking }>(`/bookings/${id}/confirm`, { method: 'PUT' }),

  cancel: (id: string) =>
    api<{ data: Booking }>(`/bookings/${id}/cancel`, { method: 'PUT' }),

  complete: (id: string) =>
    api<{ data: Booking }>(`/bookings/${id}/complete`, { method: 'PUT' }),
}

// ============================================
// MENSAGENS
// ============================================

export const messagesApi = {
  conversations: () =>
    api<{ data: Conversation[] }>('/conversations'),

  messages: (conversationId: string) =>
    api<{ data: Message[] }>(`/conversations/${conversationId}`),

  send: (receiverId: string, content: string, rideId?: string) =>
    api<{ data: Message }>('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: receiverId, content, ride_id: rideId }),
    }),

  markRead: (id: string) =>
    api<{ success: boolean }>(`/messages/${id}/read`, { method: 'PUT' }),
}

// ============================================
// FAVORITOS
// ============================================

export const favoritesApi = {
  list: () =>
    api<{ data: Ride[] }>('/favorites'),

  add: (rideId: string) =>
    api<{ success: boolean }>('/favorites', {
      method: 'POST',
      body: JSON.stringify({ ride_id: rideId }),
    }),

  remove: (rideId: string) =>
    api<{ success: boolean }>(`/favorites/${rideId}`, { method: 'DELETE' }),
}

// ============================================
// NOTIFICACOES
// ============================================

export const notificationsApi = {
  list: () =>
    api<{ data: Notification[] }>('/notifications'),

  markAllRead: () =>
    api<{ success: boolean }>('/notifications/read-all', { method: 'PUT' }),

  markRead: (id: string) =>
    api<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PUT' }),
}

// ============================================
// USUARIOS
// ============================================

export const usersApi = {
  profile: (id: string) =>
    api<{ data: UserProfile }>(`/users/${id}`),

  updateProfile: (data: Partial<UserProfile>) =>
    api<{ data: UserProfile }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(camelToSnake(data)),
    }),

  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)

    return api<{ avatarUrl: string }>('/users/avatar', {
      method: 'POST',
      body: formData,
    })
  },

  reviews: (id: string) =>
    api<{ data: Review[] }>(`/users/${id}/reviews`),
}

// ============================================
// AVALIACOES
// ============================================

export const reviewsApi = {
  create: (data: { rideId: string; reviewedId: string; rating: number; comment?: string; type: 'driver' | 'passenger' }) =>
    api<{ data: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(camelToSnake(data)),
    }),

  pending: () =>
    api<{ data: PendingReview[] }>('/reviews/pending'),
}
