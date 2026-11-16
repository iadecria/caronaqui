// Tipos compartilhados — fonte única de verdade do CaronAqui.
// Usam camelCase (como o frontend React espera). A camada de API
// (lib/api.ts) mapeia snake_case do backend para estes tipos.

export interface PaginationMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export interface Driver {
  id: string
  name: string
  avatar: string
  rating: number
  totalRides: number
  verifiedPhone: boolean
  verifiedId: boolean
  memberSince: string
  bio?: string
  gender?: 'male' | 'female' | 'other'
  role?: 'user' | 'admin' | 'dev'
  phone?: string
  email?: string
}

export interface RideLocation {
  city: string
  state: string
  neighborhood: string
  meetingPoint?: string
  dropOffPoint?: string
  lat?: number
  lng?: number
}

export interface RouteStop {
  id: string
  type: 'pickup' | 'dropoff'
  city: string
  neighborhood: string
  address: string
  time: string
  lat: number
  lng: number
  passenger?: Passenger
}

export interface Passenger {
  id: string
  name: string
  avatar: string
  rating: number
  origin: {
    city: string
    neighborhood: string
    lat?: number
    lng?: number
  }
  destination: {
    city: string
    neighborhood: string
    lat?: number
    lng?: number
  }
  seatsBooked: number
  status: 'confirmed' | 'pending' | 'cancelled'
}

export interface Ride {
  id: string
  driver: Driver
  origin: RideLocation
  destination: RideLocation
  date: string
  time: string
  price: number
  availableSeats: number
  totalSeats: number
  carModel: string
  carColor: string
  allowsPets: boolean
  allowsSmoking: boolean
  allowsLuggage: boolean
  hasAc?: boolean
  ladiesOnly?: boolean
  isRegular?: boolean
  weekdays?: string[]
  description?: string
  status?: 'active' | 'completed' | 'cancelled'
  stops?: RouteStop[]
  passengers?: Passenger[]
  originCoords?: { lat: number; lng: number }
  destinationCoords?: { lat: number; lng: number }
  distance?: number
  duration?: number
}

export interface PopularRoute {
  id: string
  from: string
  to: string
  averagePrice: number
  ridesAvailable: number
}

export interface Booking {
  id: string
  ride: Ride
  passenger: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  seatsBooked: number
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
  createdAt: string
}

export interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar: string
  }
  lastMessage: {
    content: string
    createdAt: string
    isMine: boolean
  }
  unreadCount: number
  ride?: {
    id: string
    originCity: string
    destinationCity: string
  }
}

export interface Message {
  id: string
  senderId: string
  content: string
  read: boolean
  createdAt: string
}

export type NotificationType =
  | 'reservation'
  | 'message'
  | 'reminder'
  | 'rating'
  | 'system'
  | 'info'
  | 'booking'
  | 'review'
  | 'promo'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  rideId?: string
  userId?: string
  actionUrl?: string
  data?: Record<string, unknown>
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  phone?: string
  verifiedPhone: boolean
  verifiedId: boolean
  gender?: 'male' | 'female' | 'other'
  rating: number
  totalRides: number
  memberSince: string
  bio?: string
  role?: 'user' | 'admin' | 'dev'
}

export interface Review {
  id: string
  reviewer: {
    id: string
    name: string
    avatar: string
  }
  rating: number
  comment?: string
  type: 'driver' | 'passenger'
  createdAt: string
}

export interface PendingReview {
  ride: Ride
  userToReview: {
    id: string
    name: string
    avatar: string
  }
  type: 'driver' | 'passenger'
}

export interface RideFilters {
  originCity?: string
  destinationCity?: string
  date?: string
  seats?: number
  maxPrice?: number
  allowsPets?: boolean
  ladiesOnly?: boolean
}

export interface CreateRideData {
  originCity: string
  originState: string
  originNeighborhood?: string
  originMeetingPoint?: string
  originLat?: number
  originLng?: number
  destinationCity: string
  destinationState: string
  destinationNeighborhood?: string
  destinationDropoffPoint?: string
  destinationLat?: number
  destinationLng?: number
  date: string
  time: string
  price: number
  totalSeats: number
  carModel: string
  carColor: string
  allowsPets?: boolean
  allowsSmoking?: boolean
  allowsLuggage?: boolean
  hasAc?: boolean
  ladiesOnly?: boolean
  isRegular?: boolean
  weekdays?: string[]
  description?: string
}

export interface CreateBookingData {
  rideId: string
  seatsBooked: number
  pickupCity?: string
  pickupNeighborhood?: string
  pickupLat?: number
  pickupLng?: number
  dropoffCity?: string
  dropoffNeighborhood?: string
  dropoffLat?: number
  dropoffLng?: number
}

export interface AddressSuggestion {
  id: string
  displayName: string
  city: string
  state: string
  neighborhood: string
  street: string
  lat: number
  lng: number
  type: 'city' | 'landmark' | 'address'
  isLocal?: boolean
}