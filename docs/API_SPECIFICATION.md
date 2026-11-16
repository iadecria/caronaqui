# CaronAqui - Especificacao da API para Backend Laravel

## Visao Geral

Este documento descreve a estrutura de dados e endpoints necessarios para o backend Laravel do CaronAqui.

---

## Estrutura do Banco de Dados

### Tabela: `users`
```php
Schema::create('users', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->string('avatar')->nullable();
    $table->string('phone')->nullable();
    $table->boolean('verified_phone')->default(false);
    $table->boolean('verified_id')->default(false);
    $table->enum('gender', ['male', 'female', 'other'])->nullable();
    $table->enum('role', ['user', 'admin', 'dev'])->default('user');
    $table->float('rating')->default(5.0);
    $table->integer('total_rides')->default(0);
    $table->timestamp('email_verified_at')->nullable();
    $table->rememberToken();
    $table->timestamps();
});
```

### Tabela: `vehicles`
```php
Schema::create('vehicles', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('user_id');
    $table->string('model'); // "Honda Civic"
    $table->string('color'); // "Prata"
    $table->string('plate')->nullable();
    $table->integer('seats')->default(4);
    $table->boolean('has_ac')->default(true);
    $table->boolean('is_default')->default(false);
    $table->timestamps();
    
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
});
```

### Tabela: `rides`
```php
Schema::create('rides', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('driver_id');
    
    // Origem
    $table->string('origin_city');
    $table->string('origin_state', 2);
    $table->string('origin_neighborhood')->nullable();
    $table->string('origin_meeting_point')->nullable();
    $table->decimal('origin_lat', 10, 7)->nullable();
    $table->decimal('origin_lng', 10, 7)->nullable();
    
    // Destino
    $table->string('destination_city');
    $table->string('destination_state', 2);
    $table->string('destination_neighborhood')->nullable();
    $table->string('destination_dropoff_point')->nullable();
    $table->decimal('destination_lat', 10, 7)->nullable();
    $table->decimal('destination_lng', 10, 7)->nullable();
    
    // Data/Hora
    $table->date('date');
    $table->time('time');
    
    // Detalhes
    $table->decimal('price', 8, 2);
    $table->integer('available_seats');
    $table->integer('total_seats');
    $table->string('car_model');
    $table->string('car_color');
    
    // Configuracoes
    $table->boolean('allows_pets')->default(false);
    $table->boolean('allows_smoking')->default(false);
    $table->boolean('allows_luggage')->default(true);
    $table->boolean('has_ac')->default(true);
    $table->boolean('ladies_only')->default(false);
    
    // Viagem regular (Casa-Trabalho)
    $table->boolean('is_regular')->default(false);
    $table->json('weekdays')->nullable(); // ["seg", "ter", "qua"]
    
    $table->text('description')->nullable();
    $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
    $table->timestamps();
    
    $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
});
```

### Tabela: `bookings` (Reservas)
```php
Schema::create('bookings', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('ride_id');
    $table->uuid('passenger_id');
    $table->integer('seats_booked')->default(1);
    $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
    
    // Ponto de embarque/desembarque personalizado
    $table->string('pickup_city')->nullable();
    $table->string('pickup_neighborhood')->nullable();
    $table->decimal('pickup_lat', 10, 7)->nullable();
    $table->decimal('pickup_lng', 10, 7)->nullable();
    
    $table->string('dropoff_city')->nullable();
    $table->string('dropoff_neighborhood')->nullable();
    $table->decimal('dropoff_lat', 10, 7)->nullable();
    $table->decimal('dropoff_lng', 10, 7)->nullable();
    
    $table->timestamps();
    
    $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
    $table->foreign('passenger_id')->references('id')->on('users')->onDelete('cascade');
});
```

### Tabela: `messages`
```php
Schema::create('messages', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('sender_id');
    $table->uuid('receiver_id');
    $table->uuid('ride_id')->nullable();
    $table->text('content');
    $table->boolean('read')->default(false);
    $table->timestamps();
    
    $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('receiver_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('ride_id')->references('id')->on('rides')->onDelete('set null');
});
```

### Tabela: `reviews`
```php
Schema::create('reviews', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('ride_id');
    $table->uuid('reviewer_id');
    $table->uuid('reviewed_id');
    $table->integer('rating'); // 1-5
    $table->text('comment')->nullable();
    $table->enum('type', ['driver', 'passenger']);
    $table->timestamps();
    
    $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
    $table->foreign('reviewer_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('reviewed_id')->references('id')->on('users')->onDelete('cascade');
});
```

### Tabela: `favorites`
```php
Schema::create('favorites', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('user_id');
    $table->uuid('ride_id');
    $table->timestamps();
    
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
    $table->unique(['user_id', 'ride_id']);
});
```

### Tabela: `notifications`
```php
Schema::create('notifications', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('user_id');
    $table->string('title');
    $table->text('message');
    $table->enum('type', ['booking', 'message', 'review', 'system', 'promo']);
    $table->json('data')->nullable();
    $table->boolean('read')->default(false);
    $table->timestamps();
    
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
});
```

### Tabela: `reports` (Denuncias)
```php
Schema::create('reports', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('reporter_id');
    $table->uuid('reported_id');
    $table->uuid('ride_id')->nullable();
    $table->enum('reason', ['inappropriate', 'fraud', 'safety', 'no_show', 'other']);
    $table->text('description');
    $table->enum('status', ['pending', 'reviewing', 'resolved', 'dismissed'])->default('pending');
    $table->text('admin_notes')->nullable();
    $table->timestamps();
    
    $table->foreign('reporter_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('reported_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('ride_id')->references('id')->on('rides')->onDelete('set null');
});
```

---

## Endpoints da API

### Autenticacao

```
POST   /api/auth/register     - Criar conta
POST   /api/auth/login        - Login (retorna token)
POST   /api/auth/logout       - Logout
GET    /api/auth/me           - Usuario logado
POST   /api/auth/refresh      - Renovar token
POST   /api/auth/forgot       - Esqueci senha
POST   /api/auth/reset        - Resetar senha
```

### Usuarios

```
GET    /api/users/{id}              - Perfil publico
PUT    /api/users/profile           - Atualizar perfil
POST   /api/users/avatar            - Upload avatar
POST   /api/users/verify-phone      - Enviar codigo SMS
POST   /api/users/confirm-phone     - Confirmar codigo
GET    /api/users/{id}/reviews      - Avaliacoes do usuario
```

### Caronas

```
GET    /api/rides                   - Listar/buscar caronas
POST   /api/rides                   - Criar carona
GET    /api/rides/{id}              - Detalhes da carona
PUT    /api/rides/{id}              - Atualizar carona
DELETE /api/rides/{id}              - Cancelar carona
GET    /api/rides/my                - Minhas caronas (motorista)
GET    /api/rides/popular-routes    - Rotas populares
```

#### Query params para busca:
```
GET /api/rides?origin_city=Taubate&destination_city=Sao+Jose+dos+Campos&date=2026-05-10&seats=1
```

### Reservas

```
POST   /api/bookings                - Fazer reserva
GET    /api/bookings                - Minhas reservas (passageiro)
GET    /api/bookings/{id}           - Detalhes da reserva
PUT    /api/bookings/{id}/confirm   - Confirmar reserva (motorista)
PUT    /api/bookings/{id}/cancel    - Cancelar reserva
PUT    /api/bookings/{id}/complete  - Marcar como concluida
```

### Mensagens

```
GET    /api/conversations           - Listar conversas
GET    /api/conversations/{id}      - Mensagens de uma conversa
POST   /api/messages                - Enviar mensagem
PUT    /api/messages/{id}/read      - Marcar como lida
```

### Favoritos

```
GET    /api/favorites               - Listar favoritos
POST   /api/favorites               - Adicionar favorito
DELETE /api/favorites/{ride_id}     - Remover favorito
```

### Notificacoes

```
GET    /api/notifications           - Listar notificacoes
PUT    /api/notifications/read-all  - Marcar todas como lidas
PUT    /api/notifications/{id}/read - Marcar uma como lida
```

### Avaliacoes

```
POST   /api/reviews                 - Criar avaliacao
GET    /api/reviews/pending         - Avaliacoes pendentes
```

### Admin

```
GET    /api/admin/dashboard         - Estatisticas
GET    /api/admin/users             - Listar usuarios
PUT    /api/admin/users/{id}/ban    - Banir usuario
GET    /api/admin/rides             - Listar caronas
GET    /api/admin/reports           - Listar denuncias
PUT    /api/admin/reports/{id}      - Atualizar denuncia
```

---

## Tipos TypeScript (Frontend)

Os tipos ja estao definidos em `/lib/mock-data.ts`:

```typescript
interface User {
  id: string
  name: string
  email: string
  avatar: string
  phone?: string
  verifiedPhone: boolean
  verifiedId: boolean
  memberSince: string
  role?: 'user' | 'admin' | 'dev'
  gender?: 'male' | 'female' | 'other'
  rating?: number
  totalRides?: number
}

interface Ride {
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
```

---

## Configuracao do Frontend para API

### 1. Criar arquivo de configuracao da API

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export async function api<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  
  return response.json()
}
```

### 2. Variaveis de ambiente

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Checklist de Integracao

### Frontend (Next.js)
- [x] Estrutura de paginas (App Router)
- [x] Componentes de UI (shadcn/ui)
- [x] Contextos (Auth, Booking, Messages, etc.)
- [x] Tipos TypeScript definidos
- [x] Design responsivo (Mobile-first PWA)
- [ ] Substituir mock-data por chamadas API
- [ ] Implementar SWR/React Query para cache
- [ ] Tratamento de erros de API
- [ ] Loading states

### Backend (Laravel)
- [ ] Migrations do banco de dados
- [ ] Models com relacionamentos
- [ ] Controllers da API
- [ ] Form Requests para validacao
- [ ] Resources para formatacao JSON
- [ ] Autenticacao (Laravel Sanctum)
- [ ] Middleware de autorizacao
- [ ] Testes automatizados

### Integracao
- [ ] CORS configurado
- [ ] Variaveis de ambiente
- [ ] Webhook para notificacoes push
- [ ] Upload de imagens (avatar)
- [ ] Geocoding de enderecos

---

## Proximos Passos

1. **Baixar o projeto**: Use o botao de download ou clone do GitHub
2. **Criar projeto Laravel**: `laravel new caronaqui-api`
3. **Rodar migrations**: Copiar schemas acima
4. **Implementar autenticacao**: Laravel Sanctum
5. **Criar endpoints**: Seguir especificacao acima
6. **Conectar frontend**: Substituir mock-data por api calls
