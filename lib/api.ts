// Configuracao da API para integracao com backend Laravel
// Substitua NEXT_PUBLIC_API_URL pela URL do seu backend

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

// Funcao base para chamadas API
export async function api<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('caronaqui_token') : null
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  if (token && !options?.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  })
  
  const data = await response.json().catch(() => ({}))
  
  if (!response.ok) {
    throw new ApiError(
      data.message || response.statusText,
      response.status,
      data
    )
  }
  
  return data as T
}

// ============================================
// AUTENTICACAO
// ============================================

export interface LoginResponse {
  user: {
    id: string
    name: string
    email: string
    avatar: string
    phone?: string
    verified_phone: boolean
    verified_id: boolean
    gender?: 'male' | 'female' | 'other'
    role: 'user' | 'admin' | 'dev'
    rating: number
    total_rides: number
    created_at: string
  }
  token: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
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
      body: JSON.stringify(data),
      skipAuth: true,
    }),
    
  logout: () =>
    api<{ message: string }>('/auth/logout', { method: 'POST' }),
    
  me: () =>
    api<{ user: LoginResponse['user'] }>('/auth/me'),
    
  refresh: () =>
    api<{ token: string }>('/auth/refresh', { method: 'POST' }),
}

// ============================================
// CARONAS
// ============================================

export interface RideFilters {
  origin_city?: string
  destination_city?: string
  date?: string
  seats?: number
  max_price?: number
  allows_pets?: boolean
  ladies_only?: boolean
}

export interface CreateRideData {
  origin_city: string
  origin_state: string
  origin_neighborhood?: string
  origin_meeting_point?: string
  origin_lat?: number
  origin_lng?: number
  destination_city: string
  destination_state: string
  destination_neighborhood?: string
  destination_dropoff_point?: string
  destination_lat?: number
  destination_lng?: number
  date: string
  time: string
  price: number
  total_seats: number
  car_model: string
  car_color: string
  allows_pets?: boolean
  allows_smoking?: boolean
  allows_luggage?: boolean
  has_ac?: boolean
  ladies_only?: boolean
  is_regular?: boolean
  weekdays?: string[]
  description?: string
}

export const ridesApi = {
  list: (filters?: RideFilters) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    const query = params.toString()
    return api<{ data: Ride[]; meta: PaginationMeta }>(`/rides${query ? `?${query}` : ''}`)
  },
  
  get: (id: string) =>
    api<{ data: Ride }>(`/rides/${id}`),
    
  create: (data: CreateRideData) =>
    api<{ data: Ride }>('/rides', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: Partial<CreateRideData>) =>
    api<{ data: Ride }>(`/rides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
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

export interface CreateBookingData {
  ride_id: string
  seats_booked: number
  pickup_city?: string
  pickup_neighborhood?: string
  pickup_lat?: number
  pickup_lng?: number
  dropoff_city?: string
  dropoff_neighborhood?: string
  dropoff_lat?: number
  dropoff_lng?: number
}

export const bookingsApi = {
  list: () =>
    api<{ data: Booking[] }>('/bookings'),
    
  get: (id: string) =>
    api<{ data: Booking }>(`/bookings/${id}`),
    
  create: (data: CreateBookingData) =>
    api<{ data: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
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
      body: JSON.stringify(data),
    }),
    
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    return api<{ avatar_url: string }>('/users/avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type para FormData
    })
  },
  
  reviews: (id: string) =>
    api<{ data: Review[] }>(`/users/${id}/reviews`),
}

// ============================================
// AVALIACOES
// ============================================

export const reviewsApi = {
  create: (data: { ride_id: string; reviewed_id: string; rating: number; comment?: string; type: 'driver' | 'passenger' }) =>
    api<{ data: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  pending: () =>
    api<{ data: PendingReview[] }>('/reviews/pending'),
}

// ============================================
// TIPOS AUXILIARES
// ============================================

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface Ride {
  id: string
  driver: {
    id: string
    name: string
    avatar: string
    rating: number
    total_rides: number
    verified_phone: boolean
    verified_id: boolean
  }
  origin: {
    city: string
    state: string
    neighborhood: string
    meeting_point: string
    lat?: number
    lng?: number
  }
  destination: {
    city: string
    state: string
    neighborhood: string
    dropoff_point: string
    lat?: number
    lng?: number
  }
  date: string
  time: string
  price: number
  available_seats: number
  total_seats: number
  car_model: string
  car_color: string
  allows_pets: boolean
  allows_smoking: boolean
  allows_luggage: boolean
  has_ac: boolean
  ladies_only: boolean
  description?: string
  status: 'active' | 'completed' | 'cancelled'
}

interface PopularRoute {
  from: string
  to: string
  average_price: number
  rides_available: number
}

interface Booking {
  id: string
  ride: Ride
  passenger: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  seats_booked: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  pickup?: {
    city: string
    neighborhood: string
    lat?: number
    lng?: number
  }
  dropoff?: {
    city: string
    neighborhood: string
    lat?: number
    lng?: number
  }
  created_at: string
}

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar: string
  }
  last_message: {
    content: string
    created_at: string
    is_mine: boolean
  }
  unread_count: number
  ride?: {
    id: string
    origin_city: string
    destination_city: string
  }
}

interface Message {
  id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'booking' | 'message' | 'review' | 'system' | 'promo'
  data?: Record<string, unknown>
  read: boolean
  created_at: string
}

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  phone?: string
  verified_phone: boolean
  verified_id: boolean
  gender?: 'male' | 'female' | 'other'
  rating: number
  total_rides: number
  member_since: string
  bio?: string
}

interface Review {
  id: string
  reviewer: {
    id: string
    name: string
    avatar: string
  }
  rating: number
  comment?: string
  type: 'driver' | 'passenger'
  created_at: string
}

interface PendingReview {
  ride: Ride
  user_to_review: {
    id: string
    name: string
    avatar: string
  }
  type: 'driver' | 'passenger'
}
