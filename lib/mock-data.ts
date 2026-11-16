// Tipos para o CaronAqui
export interface Driver {
  id: string
  name: string
  avatar: string
  rating: number
  totalRides: number
  verifiedPhone: boolean
  verifiedId: boolean
  memberSince: string
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

export interface Ride {
  id: string
  driver: Driver
  origin: {
    city: string
    state: string
    neighborhood: string
    meetingPoint: string
  }
  destination: {
    city: string
    state: string
    neighborhood: string
    dropOffPoint: string
  }
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
  description?: string
  passengers?: Passenger[]
  stops?: RouteStop[]
  originCoords?: { lat: number; lng: number }
  destinationCoords?: { lat: number; lng: number }
}

export interface PopularRoute {
  id: string
  from: string
  to: string
  averagePrice: number
  ridesAvailable: number
}

// Motoristas fictícios
export const mockDrivers: Driver[] = [
  {
    id: "d1",
    name: "Carlos Silva",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    rating: 4.9,
    totalRides: 234,
    verifiedPhone: true,
    verifiedId: true,
    memberSince: "2023-03-15"
  },
  {
    id: "d2",
    name: "Ana Oliveira",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    rating: 4.8,
    totalRides: 156,
    verifiedPhone: true,
    verifiedId: true,
    memberSince: "2023-06-20"
  },
  {
    id: "d3",
    name: "Roberto Santos",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
    rating: 4.7,
    totalRides: 89,
    verifiedPhone: true,
    verifiedId: false,
    memberSince: "2024-01-10"
  },
  {
    id: "d4",
    name: "Fernanda Costa",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda",
    rating: 5.0,
    totalRides: 312,
    verifiedPhone: true,
    verifiedId: true,
    memberSince: "2022-11-05"
  },
  {
    id: "d5",
    name: "Marcos Pereira",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos",
    rating: 4.6,
    totalRides: 67,
    verifiedPhone: true,
    verifiedId: true,
    memberSince: "2024-02-28"
  },
  {
    id: "d6",
    name: "Julia Mendes",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia",
    rating: 4.9,
    totalRides: 198,
    verifiedPhone: true,
    verifiedId: true,
    memberSince: "2023-08-12"
  }
]

// Helper para gerar datas dinamicas (hoje, amanha, etc)
function getDateString(daysFromNow: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0]
}

// Passageiros de exemplo
const mockPassengers: Passenger[] = [
  {
    id: "p1",
    name: "Lucas Martins",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    rating: 4.8,
    origin: {
      city: "Taubaté",
      neighborhood: "Jardim das Nações",
      lat: -23.0226,
      lng: -45.5553
    },
    destination: {
      city: "São José dos Campos",
      neighborhood: "Centro",
      lat: -23.1791,
      lng: -45.8872
    },
    seatsBooked: 1,
    status: 'confirmed'
  },
  {
    id: "p2",
    name: "Mariana Souza",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana",
    rating: 4.9,
    origin: {
      city: "Taubaté",
      neighborhood: "Centro",
      lat: -23.0260,
      lng: -45.5559
    },
    destination: {
      city: "São José dos Campos",
      neighborhood: "Jardim Aquarius",
      lat: -23.2100,
      lng: -45.8900
    },
    seatsBooked: 1,
    status: 'confirmed'
  }
]

// Caronas Taubaté - São José dos Campos
const taubateSjcRides: Ride[] = [
  // Caronas matinais de hoje
  {
    id: "r20",
    driver: mockDrivers[0],
    origin: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Centro",
      meetingPoint: "Rodoviária de Taubaté"
    },
    destination: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Centro",
      dropOffPoint: "Rodoviária de SJC"
    },
    date: getDateString(0), // Hoje
    time: "07:00",
    price: 22,
    availableSeats: 2,
    totalSeats: 4,
    carModel: "Honda Civic",
    carColor: "Prata",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Carona cedo, ideal para quem trabalha em SJC.",
    originCoords: { lat: -23.0226, lng: -45.5569 },
    destinationCoords: { lat: -23.1791, lng: -45.8872 },
    passengers: mockPassengers,
    stops: [
      {
        id: "s1",
        type: "pickup",
        city: "Taubaté",
        neighborhood: "Centro",
        address: "Rodoviária de Taubaté",
        time: "07:00",
        lat: -23.0226,
        lng: -45.5569
      },
      {
        id: "s2",
        type: "pickup",
        city: "Taubaté",
        neighborhood: "Jardim das Nações",
        address: "Próximo ao Shopping",
        time: "07:10",
        lat: -23.0280,
        lng: -45.5600,
        passenger: mockPassengers[0]
      },
      {
        id: "s3",
        type: "dropoff",
        city: "São José dos Campos",
        neighborhood: "Jardim Aquarius",
        address: "Shopping Colinas",
        time: "07:45",
        lat: -23.2100,
        lng: -45.8900,
        passenger: mockPassengers[1]
      },
      {
        id: "s4",
        type: "dropoff",
        city: "São José dos Campos",
        neighborhood: "Centro",
        address: "Rodoviária de SJC",
        time: "07:55",
        lat: -23.1791,
        lng: -45.8872
      }
    ]
  },
  {
    id: "r21",
    driver: mockDrivers[1],
    origin: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Jardim das Nacoes",
      meetingPoint: "Shopping Taubaté"
    },
    destination: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Jardim Aquarius",
      dropOffPoint: "Shopping Colinas"
    },
    date: getDateString(0), // Hoje
    time: "08:30",
    price: 28,
    availableSeats: 2,
    totalSeats: 4,
    carModel: "Toyota Corolla",
    carColor: "Branco",
    allowsPets: true,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Viagem tranquila, aceito animais pequenos.",
    originCoords: { lat: -23.0280, lng: -45.5600 },
    destinationCoords: { lat: -23.2100, lng: -45.8900 }
  },
  {
    id: "r22",
    driver: mockDrivers[5],
    origin: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Centro",
      meetingPoint: "Terminal Rodoviário"
    },
    destination: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Centro",
      dropOffPoint: "Praça Afonso Pena"
    },
    date: getDateString(0), // Hoje
    time: "12:00",
    price: 25,
    availableSeats: 4,
    totalSeats: 4,
    carModel: "Honda Fit",
    carColor: "Prata",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Saída ao meio-dia, horário de almoço.",
    originCoords: { lat: -23.0226, lng: -45.5569 },
    destinationCoords: { lat: -23.1791, lng: -45.8872 }
  },
  {
    id: "r23",
    driver: mockDrivers[3],
    origin: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Areao",
      meetingPoint: "Praça Santa Terezinha"
    },
    destination: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Vila Adyana",
      dropOffPoint: "Parque Vicentina Aranha"
    },
    date: getDateString(0), // Hoje
    time: "15:00",
    price: 27,
    availableSeats: 3,
    totalSeats: 4,
    carModel: "Jeep Compass",
    carColor: "Vermelho",
    allowsPets: true,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Viagem a tarde, carro espaçoso.",
    originCoords: { lat: -23.0250, lng: -45.5550 },
    destinationCoords: { lat: -23.2100, lng: -45.8900 }
  },
  // Caronas do fim da tarde/noite
  {
    id: "r9",
    driver: mockDrivers[2],
    origin: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Centro",
      meetingPoint: "Rodoviária de Taubaté"
    },
    destination: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Centro",
      dropOffPoint: "Rodoviária de SJC"
    },
    date: getDateString(0), // Hoje
    time: "18:00",
    price: 25,
    availableSeats: 3,
    totalSeats: 4,
    carModel: "Volkswagen Polo",
    carColor: "Branco",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Viagem rápida pela Dutra. Saída pontual.",
    originCoords: { lat: -23.0226, lng: -45.5569 },
    destinationCoords: { lat: -23.1791, lng: -45.8872 }
  },
  {
    id: "r10",
    driver: mockDrivers[3],
    origin: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Jardim das Nações",
      meetingPoint: "Shopping Taubaté"
    },
    destination: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Jardim Aquarius",
      dropOffPoint: "Shopping Colinas"
    },
    date: getDateString(0), // Hoje
    time: "19:30",
    price: 30,
    availableSeats: 2,
    totalSeats: 4,
    carModel: "Jeep Compass",
    carColor: "Vermelho",
    allowsPets: true,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Carro confortável, aceito pets pequenos.",
    originCoords: { lat: -23.0280, lng: -45.5600 },
    destinationCoords: { lat: -23.2100, lng: -45.8900 }
  },
  {
    id: "r11",
    driver: mockDrivers[5],
    origin: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Areão",
      meetingPoint: "Praça Santa Terezinha"
    },
    destination: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Vila Adyana",
      dropOffPoint: "Parque Vicentina Aranha"
    },
    date: getDateString(0), // Hoje
    time: "20:00",
    price: 28,
    availableSeats: 4,
    totalSeats: 4,
    carModel: "Honda Fit",
    carColor: "Prata",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    originCoords: { lat: -23.0250, lng: -45.5550 },
    destinationCoords: { lat: -23.2100, lng: -45.8900 }
  },
  {
    id: "r14",
    driver: mockDrivers[1],
    origin: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Centro",
      meetingPoint: "Terminal Rodoviário"
    },
    destination: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Centro",
      dropOffPoint: "Praça Afonso Pena"
    },
    date: getDateString(0), // Hoje
    time: "21:00",
    price: 25,
    availableSeats: 3,
    totalSeats: 4,
    carModel: "Toyota Corolla",
    carColor: "Branco",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Viagem noturna, carro confortável.",
    originCoords: { lat: -23.0226, lng: -45.5569 },
    destinationCoords: { lat: -23.1791, lng: -45.8872 }
  },
  {
    id: "r12",
    driver: mockDrivers[0],
    origin: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Centro",
      meetingPoint: "Rodoviária de SJC"
    },
    destination: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Centro",
      dropOffPoint: "Rodoviária de Taubaté"
    },
    date: getDateString(0), // Hoje
    time: "18:00",
    price: 25,
    availableSeats: 3,
    totalSeats: 4,
    carModel: "Honda Civic",
    carColor: "Prata",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Volta do trabalho, saída às 18h.",
    originCoords: { lat: -23.1791, lng: -45.8872 },
    destinationCoords: { lat: -23.0226, lng: -45.5569 }
  },
  {
    id: "r15",
    driver: mockDrivers[4],
    origin: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Jardim Aquarius",
      meetingPoint: "Shopping Colinas"
    },
    destination: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Centro",
      dropOffPoint: "Praça Santa Terezinha"
    },
    date: getDateString(0), // Hoje
    time: "19:00",
    price: 28,
    availableSeats: 2,
    totalSeats: 4,
    carModel: "Chevrolet Cruze",
    carColor: "Azul",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    originCoords: { lat: -23.2100, lng: -45.8900 },
    destinationCoords: { lat: -23.0226, lng: -45.5569 }
  },
  {
    id: "r13",
    driver: mockDrivers[4],
    origin: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Jardim Aquarius",
      meetingPoint: "Shopping Colinas"
    },
    destination: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Jardim das Nações",
      dropOffPoint: "Shopping Taubaté"
    },
    date: getDateString(1), // Amanha
    time: "07:00",
    price: 30,
    availableSeats: 2,
    totalSeats: 4,
    carModel: "Chevrolet Cruze",
    carColor: "Azul",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    originCoords: { lat: -23.2100, lng: -45.8900 },
    destinationCoords: { lat: -23.0280, lng: -45.5600 }
  },
  {
    id: "r16",
    driver: mockDrivers[2],
    origin: {
      city: "Taubaté",
      state: "SP",
      neighborhood: "Centro",
      meetingPoint: "Rodoviária de Taubaté"
    },
    destination: {
      city: "São José dos Campos",
      state: "SP",
      neighborhood: "Centro",
      dropOffPoint: "Rodoviária de SJC"
    },
    date: getDateString(1), // Amanha
    time: "08:00",
    price: 25,
    availableSeats: 4,
    totalSeats: 4,
    carModel: "Volkswagen Polo",
    carColor: "Branco",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Saída cedo, viagem tranquila.",
    originCoords: { lat: -23.0226, lng: -45.5569 },
    destinationCoords: { lat: -23.1791, lng: -45.8872 }
  }
]

// Combinar todas as caronas
export const mockRides: Ride[] = [
  ...taubateSjcRides,
  // Caronas Rio-SP originais abaixo
  {
    id: "r1",
    driver: mockDrivers[0],
    origin: {
      city: "Rio de Janeiro",
      state: "RJ",
      neighborhood: "Centro",
      meetingPoint: "Estação Central do Brasil"
    },
    destination: {
      city: "São Paulo",
      state: "SP",
      neighborhood: "Consolação",
      dropOffPoint: "Av. Paulista"
    },
    date: "2026-04-18",
    time: "06:00",
    price: 85,
    availableSeats: 3,
    totalSeats: 4,
    carModel: "Honda Civic",
    carColor: "Prata",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Saída pontual. Parada para café na metade do caminho.",
    originCoords: { lat: -22.9068, lng: -43.1729 },
    destinationCoords: { lat: -23.5505, lng: -46.6333 }
  },
  {
    id: "r2",
    driver: mockDrivers[1],
    origin: {
      city: "São Paulo",
      state: "SP",
      neighborhood: "Moema",
      meetingPoint: "Shopping Ibirapuera"
    },
    destination: {
      city: "Rio de Janeiro",
      state: "RJ",
      neighborhood: "Barra da Tijuca",
      dropOffPoint: "BarraShopping"
    },
    date: "2026-04-18",
    time: "07:30",
    price: 90,
    availableSeats: 2,
    totalSeats: 4,
    carModel: "Toyota Corolla",
    carColor: "Branco",
    allowsPets: true,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Aceito pets pequenos em caixa de transporte.",
    originCoords: { lat: -23.5505, lng: -46.6333 },
    destinationCoords: { lat: -22.9068, lng: -43.1729 }
  },
  {
    id: "r3",
    driver: mockDrivers[2],
    origin: {
      city: "Rio de Janeiro",
      state: "RJ",
      neighborhood: "Tijuca",
      meetingPoint: "Metrô Saens Peña"
    },
    destination: {
      city: "São Paulo",
      state: "SP",
      neighborhood: "Pinheiros",
      dropOffPoint: "Largo da Batata"
    },
    date: "2026-04-19",
    time: "05:30",
    price: 80,
    availableSeats: 4,
    totalSeats: 4,
    carModel: "Volkswagen Jetta",
    carColor: "Preto",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Viagem direta sem paradas.",
    originCoords: { lat: -22.9068, lng: -43.1729 },
    destinationCoords: { lat: -23.5505, lng: -46.6333 }
  },
  {
    id: "r4",
    driver: mockDrivers[3],
    origin: {
      city: "São Paulo",
      state: "SP",
      neighborhood: "Vila Mariana",
      meetingPoint: "Metrô Ana Rosa"
    },
    destination: {
      city: "Rio de Janeiro",
      state: "RJ",
      neighborhood: "Copacabana",
      dropOffPoint: "Posto 5"
    },
    date: "2026-04-19",
    time: "14:00",
    price: 95,
    availableSeats: 1,
    totalSeats: 3,
    carModel: "Jeep Compass",
    carColor: "Vermelho",
    allowsPets: true,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Carro confortável, ar-condicionado, música ambiente.",
    originCoords: { lat: -23.5505, lng: -46.6333 },
    destinationCoords: { lat: -22.9068, lng: -43.1729 }
  },
  {
    id: "r5",
    driver: mockDrivers[4],
    origin: {
      city: "Rio de Janeiro",
      state: "RJ",
      neighborhood: "Botafogo",
      meetingPoint: "Metrô Botafogo"
    },
    destination: {
      city: "São Paulo",
      state: "SP",
      neighborhood: "Itaim Bibi",
      dropOffPoint: "Av. Faria Lima"
    },
    date: "2026-04-20",
    time: "08:00",
    price: 88,
    availableSeats: 3,
    totalSeats: 4,
    carModel: "Chevrolet Cruze",
    carColor: "Azul",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    originCoords: { lat: -22.9068, lng: -43.1729 },
    destinationCoords: { lat: -23.5505, lng: -46.6333 }
  },
  {
    id: "r6",
    driver: mockDrivers[5],
    origin: {
      city: "São Paulo",
      state: "SP",
      neighborhood: "Brooklin",
      meetingPoint: "Shopping Morumbi"
    },
    destination: {
      city: "Rio de Janeiro",
      state: "RJ",
      neighborhood: "Leblon",
      dropOffPoint: "Shopping Leblon"
    },
    date: "2026-04-20",
    time: "16:00",
    price: 92,
    availableSeats: 2,
    totalSeats: 4,
    carModel: "BMW 320i",
    carColor: "Cinza",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    description: "Viagem executiva, pontualidade garantida.",
    originCoords: { lat: -23.5505, lng: -46.6333 },
    destinationCoords: { lat: -22.9068, lng: -43.1729 }
  },
  {
    id: "r7",
    driver: mockDrivers[0],
    origin: {
      city: "Rio de Janeiro",
      state: "RJ",
      neighborhood: "Recreio",
      meetingPoint: "Shopping Recreio"
    },
    destination: {
      city: "São Paulo",
      state: "SP",
      neighborhood: "Jardins",
      dropOffPoint: "Rua Oscar Freire"
    },
    date: "2026-04-21",
    time: "06:30",
    price: 85,
    availableSeats: 4,
    totalSeats: 4,
    carModel: "Honda Civic",
    carColor: "Prata",
    allowsPets: false,
    allowsSmoking: false,
    allowsLuggage: true,
    originCoords: { lat: -22.9068, lng: -43.1729 },
    destinationCoords: { lat: -23.5505, lng: -46.6333 }
  },
  {
    id: "r8",
    driver: mockDrivers[1],
    origin: {
      city: "São Paulo",
      state: "SP",
      neighborhood: "Santana",
      meetingPoint: "Shopping Santana Parque"
    },
    destination: {
      city: "Rio de Janeiro",
      state: "RJ",
      neighborhood: "Flamengo",
      dropOffPoint: "Aterro do Flamengo"
    },
    date: "2026-04-21",
    time: "09:00",
    price: 88,
    availableSeats: 3,
    totalSeats: 4,
    carModel: "Toyota Corolla",
    carColor: "Branco",
    allowsPets: true,
    allowsSmoking: false,
    allowsLuggage: true,
    originCoords: { lat: -23.5505, lng: -46.6333 },
    destinationCoords: { lat: -22.9068, lng: -43.1729 }
  }
]

// Rotas populares
export const mockPopularRoutes: PopularRoute[] = [
  {
    id: "pr1",
    from: "Taubaté",
    to: "São José dos Campos",
    averagePrice: 28,
    ridesAvailable: 5
  },
  {
    id: "pr2",
    from: "Rio de Janeiro",
    to: "São Paulo",
    averagePrice: 85,
    ridesAvailable: 12
  },
  {
    id: "pr3",
    from: "São Paulo",
    to: "Rio de Janeiro",
    averagePrice: 88,
    ridesAvailable: 9
  },
  {
    id: "pr4",
    from: "São José dos Campos",
    to: "Taubaté",
    averagePrice: 27,
    ridesAvailable: 4
  }
]

// Função para formatar data
export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00Z')
  const weekdays = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sab.']
  const months = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']
  
  const weekday = weekdays[date.getUTCDay()]
  const day = date.getUTCDate()
  const month = months[date.getUTCMonth()]
  
  return `${weekday}, ${day} de ${month}`
}

// Função para formatar preço
export function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}
