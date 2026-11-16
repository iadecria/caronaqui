# CaronAqui - Fase 6: Integracao com Laravel

## Visao Geral

Este documento serve como guia completo para integrar o frontend Next.js (exportado estaticamente) com um backend Laravel hospedado no Hostinger compartilhado.

**Stack Final:**
- Frontend: Next.js (static export) -> pasta `public_html/app`
- Backend: Laravel 11 -> pasta `public_html/api`
- Database: MySQL (Hostinger)
- Storage: Hostinger File Manager

---

## 1. Estrutura de Pastas no Hostinger

```
public_html/
├── app/                    # Frontend Next.js (conteudo da pasta 'out')
│   ├── index.html
│   ├── dashboard/
│   ├── _next/
│   └── ...
├── api/                    # Backend Laravel
│   ├── public/            # Document root do Laravel
│   │   └── index.php
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── ...
├── .htaccess              # Roteamento principal
└── index.php              # Redirect para /app
```

---

## 2. Configuracao do .htaccess Principal

```apache
# public_html/.htaccess
RewriteEngine On

# API requests -> Laravel
RewriteCond %{REQUEST_URI} ^/api
RewriteRule ^api/(.*)$ /api/public/$1 [L]

# Static assets do Next.js
RewriteCond %{REQUEST_URI} ^/_next
RewriteRule ^(.*)$ /app/$1 [L]

# App routes -> Next.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /app/$1 [L]
```

---

## 3. Modelos e Migrations do Laravel

### 3.1 Migration: users
```php
// database/migrations/xxxx_create_users_table.php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('phone')->nullable();
    $table->string('password');
    $table->string('avatar')->nullable();
    $table->text('bio')->nullable();
    $table->decimal('rating', 2, 1)->default(5.0);
    $table->integer('total_rides')->default(0);
    $table->integer('total_reviews')->default(0);
    $table->boolean('verified')->default(false);
    $table->boolean('document_verified')->default(false);
    $table->boolean('phone_verified')->default(false);
    $table->timestamp('member_since')->useCurrent();
    $table->rememberToken();
    $table->timestamps();
});
```

### 3.2 Migration: vehicles
```php
// database/migrations/xxxx_create_vehicles_table.php
Schema::create('vehicles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('model');           // "Honda Civic"
    $table->string('color');           // "Prata"
    $table->string('plate')->nullable(); // "ABC-1234"
    $table->integer('year')->nullable();
    $table->integer('seats')->default(4);
    $table->boolean('is_default')->default(false);
    $table->timestamps();
});
```

### 3.3 Migration: rides
```php
// database/migrations/xxxx_create_rides_table.php
Schema::create('rides', function (Blueprint $table) {
    $table->id();
    $table->foreignId('driver_id')->constrained('users')->onDelete('cascade');
    $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
    
    // Origem
    $table->string('origin_state');
    $table->string('origin_city');
    $table->string('origin_neighborhood')->nullable();
    $table->string('origin_meeting_point')->nullable();
    
    // Destino
    $table->string('destination_state');
    $table->string('destination_city');
    $table->string('destination_neighborhood')->nullable();
    $table->string('destination_drop_point')->nullable();
    
    // Data/Hora
    $table->date('date');
    $table->time('time');
    
    // Detalhes
    $table->integer('seats_available');
    $table->integer('seats_total');
    $table->decimal('price', 8, 2);
    $table->text('description')->nullable();
    
    // Confortos
    $table->boolean('allows_pets')->default(false);
    $table->boolean('allows_smoking')->default(false);
    $table->boolean('allows_luggage')->default(true);
    
    // Status
    $table->enum('status', ['active', 'full', 'cancelled', 'completed'])->default('active');
    
    $table->timestamps();
});
```

### 3.4 Migration: bookings
```php
// database/migrations/xxxx_create_bookings_table.php
Schema::create('bookings', function (Blueprint $table) {
    $table->id();
    $table->foreignId('ride_id')->constrained()->onDelete('cascade');
    $table->foreignId('passenger_id')->constrained('users')->onDelete('cascade');
    $table->integer('seats')->default(1);
    $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
    $table->text('message')->nullable();
    $table->timestamps();
    
    $table->unique(['ride_id', 'passenger_id']);
});
```

### 3.5 Migration: reviews
```php
// database/migrations/xxxx_create_reviews_table.php
Schema::create('reviews', function (Blueprint $table) {
    $table->id();
    $table->foreignId('booking_id')->constrained()->onDelete('cascade');
    $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
    $table->foreignId('reviewed_id')->constrained('users')->onDelete('cascade');
    $table->integer('rating'); // 1-5
    $table->text('comment')->nullable();
    $table->enum('type', ['driver', 'passenger']);
    $table->timestamps();
});
```

### 3.6 Migration: favorites
```php
// database/migrations/xxxx_create_favorites_table.php
Schema::create('favorites', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('ride_id')->constrained()->onDelete('cascade');
    $table->timestamps();
    
    $table->unique(['user_id', 'ride_id']);
});
```

### 3.7 Migration: notifications
```php
// database/migrations/xxxx_create_notifications_table.php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->enum('type', ['booking', 'message', 'reminder', 'rating', 'system']);
    $table->string('title');
    $table->text('message');
    $table->json('data')->nullable(); // { ride_id, booking_id, etc }
    $table->boolean('read')->default(false);
    $table->timestamps();
});
```

---

## 4. Endpoints da API

### 4.1 Autenticacao
```
POST   /api/auth/register        # Cadastro
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
GET    /api/auth/me              # Usuario atual
PUT    /api/auth/profile         # Atualizar perfil
POST   /api/auth/avatar          # Upload avatar
```

### 4.2 Caronas
```
GET    /api/rides                # Listar caronas (com filtros)
GET    /api/rides/{id}           # Detalhes da carona
POST   /api/rides                # Publicar carona
PUT    /api/rides/{id}           # Editar carona
DELETE /api/rides/{id}           # Cancelar carona
GET    /api/rides/my             # Minhas caronas publicadas
```

### 4.3 Reservas
```
POST   /api/bookings             # Solicitar vaga
GET    /api/bookings             # Minhas reservas
PUT    /api/bookings/{id}        # Atualizar status
DELETE /api/bookings/{id}        # Cancelar reserva
```

### 4.4 Favoritos
```
GET    /api/favorites            # Listar favoritos
POST   /api/favorites/{ride_id}  # Adicionar favorito
DELETE /api/favorites/{ride_id}  # Remover favorito
```

### 4.5 Avaliacoes
```
POST   /api/reviews              # Avaliar viagem
GET    /api/users/{id}/reviews   # Avaliacoes do usuario
```

### 4.6 Notificacoes
```
GET    /api/notifications        # Listar notificacoes
PUT    /api/notifications/{id}/read  # Marcar como lida
PUT    /api/notifications/read-all   # Marcar todas como lidas
```

### 4.7 Veiculos
```
GET    /api/vehicles             # Meus veiculos
POST   /api/vehicles             # Adicionar veiculo
PUT    /api/vehicles/{id}        # Editar veiculo
DELETE /api/vehicles/{id}        # Remover veiculo
```

---

## 5. Controllers Laravel

### 5.1 AuthController
```php
// app/Http/Controllers/AuthController.php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'required|string',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($validated)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais invalidas.'],
            ]);
        }

        $user = User::where('email', $validated['email'])->first();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout realizado.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('vehicles'));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string',
            'bio' => 'sometimes|string|max:500',
        ]);

        $user->update($validated);

        return response()->json($user);
    }
}
```

### 5.2 RideController
```php
// app/Http/Controllers/RideController.php
<?php

namespace App\Http\Controllers;

use App\Models\Ride;
use Illuminate\Http\Request;

class RideController extends Controller
{
    public function index(Request $request)
    {
        $query = Ride::with(['driver', 'vehicle'])
            ->where('status', 'active')
            ->where('date', '>=', now()->toDateString());

        // Filtros
        if ($request->origin_city) {
            $query->where('origin_city', 'like', "%{$request->origin_city}%");
        }
        if ($request->destination_city) {
            $query->where('destination_city', 'like', "%{$request->destination_city}%");
        }
        if ($request->date) {
            $query->whereDate('date', $request->date);
        }
        if ($request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }
        if ($request->allows_pets) {
            $query->where('allows_pets', true);
        }
        if ($request->allows_luggage) {
            $query->where('allows_luggage', true);
        }

        $rides = $query->orderBy('date')->orderBy('time')->paginate(20);

        return response()->json($rides);
    }

    public function show(Ride $ride)
    {
        return response()->json(
            $ride->load(['driver', 'vehicle', 'bookings.passenger'])
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'origin_state' => 'required|string',
            'origin_city' => 'required|string',
            'origin_neighborhood' => 'nullable|string',
            'origin_meeting_point' => 'nullable|string',
            'destination_state' => 'required|string',
            'destination_city' => 'required|string',
            'destination_neighborhood' => 'nullable|string',
            'destination_drop_point' => 'nullable|string',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required',
            'seats_available' => 'required|integer|min:1|max:7',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:500',
            'allows_pets' => 'boolean',
            'allows_smoking' => 'boolean',
            'allows_luggage' => 'boolean',
        ]);

        $ride = $request->user()->ridesAsDriver()->create([
            ...$validated,
            'seats_total' => $validated['seats_available'],
        ]);

        return response()->json($ride->load(['driver', 'vehicle']), 201);
    }

    public function update(Request $request, Ride $ride)
    {
        $this->authorize('update', $ride);

        $validated = $request->validate([
            'date' => 'sometimes|date|after_or_equal:today',
            'time' => 'sometimes',
            'seats_available' => 'sometimes|integer|min:0',
            'price' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string|max:500',
            'status' => 'sometimes|in:active,cancelled',
        ]);

        $ride->update($validated);

        return response()->json($ride);
    }

    public function destroy(Ride $ride)
    {
        $this->authorize('delete', $ride);

        $ride->update(['status' => 'cancelled']);

        // Notificar passageiros
        foreach ($ride->bookings as $booking) {
            $booking->passenger->notifications()->create([
                'type' => 'system',
                'title' => 'Carona cancelada',
                'message' => "A carona para {$ride->destination_city} foi cancelada pelo motorista.",
                'data' => ['ride_id' => $ride->id],
            ]);
        }

        return response()->json(['message' => 'Carona cancelada.']);
    }

    public function myRides(Request $request)
    {
        $rides = $request->user()
            ->ridesAsDriver()
            ->with(['vehicle', 'bookings.passenger'])
            ->orderBy('date', 'desc')
            ->paginate(20);

        return response()->json($rides);
    }
}
```

### 5.3 BookingController
```php
// app/Http/Controllers/BookingController.php
<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Ride;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = $request->user()
            ->bookings()
            ->with(['ride.driver', 'ride.vehicle'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ride_id' => 'required|exists:rides,id',
            'seats' => 'required|integer|min:1',
            'message' => 'nullable|string|max:500',
        ]);

        $ride = Ride::findOrFail($validated['ride_id']);

        // Verificacoes
        if ($ride->driver_id === $request->user()->id) {
            return response()->json(['error' => 'Voce nao pode reservar sua propria carona.'], 422);
        }

        if ($ride->seats_available < $validated['seats']) {
            return response()->json(['error' => 'Vagas insuficientes.'], 422);
        }

        $existingBooking = Booking::where('ride_id', $ride->id)
            ->where('passenger_id', $request->user()->id)
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'Voce ja solicitou vaga nesta carona.'], 422);
        }

        $booking = Booking::create([
            'ride_id' => $ride->id,
            'passenger_id' => $request->user()->id,
            'seats' => $validated['seats'],
            'message' => $validated['message'],
        ]);

        // Notificar motorista
        $ride->driver->notifications()->create([
            'type' => 'booking',
            'title' => 'Nova solicitacao de vaga',
            'message' => "{$request->user()->name} quer ir junto na sua carona para {$ride->destination_city}.",
            'data' => ['booking_id' => $booking->id, 'ride_id' => $ride->id],
        ]);

        return response()->json($booking->load(['ride.driver', 'ride.vehicle']), 201);
    }

    public function update(Request $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        $validated = $request->validate([
            'status' => 'required|in:confirmed,cancelled',
        ]);

        $oldStatus = $booking->status;
        $booking->update($validated);

        // Se confirmado, atualizar vagas disponiveis
        if ($validated['status'] === 'confirmed' && $oldStatus === 'pending') {
            $booking->ride->decrement('seats_available', $booking->seats);

            // Notificar passageiro
            $booking->passenger->notifications()->create([
                'type' => 'booking',
                'title' => 'Vaga confirmada!',
                'message' => "Sua vaga na carona para {$booking->ride->destination_city} foi confirmada.",
                'data' => ['booking_id' => $booking->id, 'ride_id' => $booking->ride_id],
            ]);
        }

        // Se cancelado, devolver vagas
        if ($validated['status'] === 'cancelled' && $oldStatus === 'confirmed') {
            $booking->ride->increment('seats_available', $booking->seats);
        }

        return response()->json($booking);
    }

    public function destroy(Booking $booking)
    {
        $this->authorize('delete', $booking);

        if ($booking->status === 'confirmed') {
            $booking->ride->increment('seats_available', $booking->seats);
        }

        $booking->delete();

        return response()->json(['message' => 'Reserva cancelada.']);
    }
}
```

---

## 6. Configuracao do Frontend

### 6.1 Arquivo de configuracao da API
```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seudominio.com/api'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: object
  token?: string
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro na requisicao')
  }

  return response.json()
}
```

### 6.2 Atualizacao do AuthContext
```typescript
// contexts/auth-context.tsx - Alteracoes necessarias

// Adicionar funcoes de API
const login = async (email: string, password: string) => {
  setIsLoading(true)
  try {
    const response = await api<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    
    localStorage.setItem('token', response.token)
    setUser(response.user)
    setIsAuthenticated(true)
    router.push('/dashboard')
  } catch (error) {
    throw error
  } finally {
    setIsLoading(false)
  }
}

const register = async (data: RegisterData) => {
  setIsLoading(true)
  try {
    const response = await api<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: data,
    })
    
    localStorage.setItem('token', response.token)
    setUser(response.user)
    setIsAuthenticated(true)
    router.push('/dashboard')
  } catch (error) {
    throw error
  } finally {
    setIsLoading(false)
  }
}

const logout = async () => {
  const token = localStorage.getItem('token')
  if (token) {
    await api('/auth/logout', { method: 'POST', token })
  }
  localStorage.removeItem('token')
  setUser(null)
  setIsAuthenticated(false)
  router.push('/')
}

// Verificar token ao carregar
useEffect(() => {
  const token = localStorage.getItem('token')
  if (token) {
    api<User>('/auth/me', { token })
      .then(user => {
        setUser(user)
        setIsAuthenticated(true)
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setIsLoading(false))
  } else {
    setIsLoading(false)
  }
}, [])
```

### 6.3 Hooks customizados para API
```typescript
// hooks/use-rides.ts
import useSWR from 'swr'
import { api } from '@/lib/api'

export function useRides(filters?: RideFilters) {
  const params = new URLSearchParams(filters as any).toString()
  const { data, error, mutate } = useSWR(
    `/rides?${params}`,
    (url) => api(url, { token: localStorage.getItem('token') || undefined })
  )

  return {
    rides: data?.data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

// hooks/use-bookings.ts
export function useBookings() {
  const token = localStorage.getItem('token')
  const { data, error, mutate } = useSWR(
    token ? '/bookings' : null,
    (url) => api(url, { token: token! })
  )

  return {
    bookings: data?.data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
```

---

## 7. Variaveis de Ambiente

### 7.1 Laravel (.env)
```env
APP_NAME=CaronAqui
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seudominio.com/api

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=caronaqui_db
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha

SANCTUM_STATEFUL_DOMAINS=seudominio.com
SESSION_DOMAIN=.seudominio.com

CORS_ALLOWED_ORIGINS=https://seudominio.com
```

### 7.2 Next.js (.env.local)
```env
NEXT_PUBLIC_API_URL=https://seudominio.com/api
```

---

## 8. Deploy no Hostinger

### 8.1 Preparar Frontend
```bash
# No projeto Next.js
npm run build
# Isso gera a pasta 'out' com os arquivos estaticos

# Upload da pasta 'out' para public_html/app via File Manager ou FTP
```

### 8.2 Preparar Backend
```bash
# No projeto Laravel
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Upload de todo o projeto Laravel para public_html/api via FTP
# (exceto a pasta 'public', que fica como document root)
```

### 8.3 Configurar PHP no Hostinger
- PHP 8.2+
- Habilitar extensoes: pdo_mysql, mbstring, openssl, tokenizer, xml, ctype, json

### 8.4 Executar Migrations
```bash
# Via SSH ou terminal do Hostinger
cd ~/public_html/api
php artisan migrate --force
php artisan db:seed --force  # Se tiver seeders
```

---

## 9. Checklist de Implementacao

### Backend Laravel
- [ ] Criar projeto Laravel: `composer create-project laravel/laravel api`
- [ ] Configurar .env com credenciais do banco
- [ ] Instalar Sanctum: `composer require laravel/sanctum`
- [ ] Publicar config Sanctum: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
- [ ] Criar migrations (users, vehicles, rides, bookings, reviews, favorites, notifications)
- [ ] Executar migrations: `php artisan migrate`
- [ ] Criar Models com relacionamentos
- [ ] Criar Controllers (Auth, Ride, Booking, Favorite, Review, Notification, Vehicle)
- [ ] Criar Policies para autorizacao
- [ ] Configurar rotas em routes/api.php
- [ ] Configurar CORS em config/cors.php
- [ ] Testar endpoints com Postman/Insomnia
- [ ] Deploy no Hostinger

### Frontend Next.js
- [ ] Criar lib/api.ts com funcoes de requisicao
- [ ] Atualizar AuthContext para usar API real
- [ ] Atualizar FavoritesContext para usar API
- [ ] Atualizar NotificationsContext para usar API
- [ ] Criar hooks SWR para dados (useRides, useBookings, etc)
- [ ] Atualizar componentes para usar dados da API
- [ ] Remover mock-data.ts (ou manter como fallback)
- [ ] Configurar NEXT_PUBLIC_API_URL
- [ ] Build estatico: `npm run build`
- [ ] Deploy no Hostinger

---

## 10. Identidade e Tom de Voz

### Personalidade
**Descontraido. Confiavel. Direto. Humano. Conectado.**

### Tom de Voz
- Extrovertido mas nao invasivo
- Direto e informal (fala como amigo)
- Humor leve, nunca constrangedor
- Empatico (entende que viajar junto e confianca)
- Zero corporatives ("prezado usuario", "conforme solicitado")

### Frases por Contexto

**Home:**
- "Pra onde voce ta indo hoje?"
- "Sua proxima carona ta esperando."
- "Divide a estrada, divide o custo."

**Busca sem resultados:**
- "Ninguem indo pra la ainda... que tal publicar a sua?"
- "Essa rota ta vazia. Mas voce pode mudar isso."

**Busca com resultados:**
- "Achamos quem vai pro mesmo lugar que voce."
- "{N} caronas disponiveis. Escolhe a sua."

**Publicar carona:**
- "De onde voce sai e onde vai?"
- "Quando e a viagem?"
- "Quanto voce quer cobrar?"
- "Divide justo, todo mundo ganha."

**Termometro de Preco:**
- Muito barato: "Ta quase de graca. Tem certeza?"
- Barato: "Preco camarada. Vai lotar rapido."
- Justo: "Preco justo. Motorista feliz, passageiro feliz."
- Caro: "Ta salgadinho. Mas se o carro for bom, vai."
- Muito caro: "Uber ta mais barato. Pensa bem..."

**Sucesso:**
- "Carona publicada! Agora e esperar a galera entrar."
- "Vaga garantida! Boa viagem."
- "Ta confirmado. Nos vemos na estrada."

**Erros:**
- "Algo deu errado. Tenta de novo?"
- "Ops. Isso nao era pra acontecer."

### Taglines
- Principal: "Divide a estrada."
- Alternativa: "Sua carona, sua vibe."
- Alternativa: "A Via Dutra e grande. Vai junto."

### O que NUNCA fazer
- Usar "prezado usuario" ou linguagem formal
- Usar emojis no app (apenas icones Lucide)
- Ser agressivo ou urgente demais ("CORRA! ULTIMA VAGA!")
- Prometer o que nao pode cumprir

---

## 11. Estrutura de Arquivos Final

```
caronaqui/
├── frontend/                 # Next.js (este projeto)
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts           # Cliente da API
│   │   ├── mock-data.ts     # Dados mockados (fallback)
│   │   └── utils.ts
│   └── out/                  # Build estatico
│
└── backend/                  # Laravel (novo projeto)
    ├── app/
    │   ├── Http/
    │   │   └── Controllers/
    │   │       ├── AuthController.php
    │   │       ├── RideController.php
    │   │       ├── BookingController.php
    │   │       ├── FavoriteController.php
    │   │       ├── ReviewController.php
    │   │       ├── NotificationController.php
    │   │       └── VehicleController.php
    │   ├── Models/
    │   │   ├── User.php
    │   │   ├── Vehicle.php
    │   │   ├── Ride.php
    │   │   ├── Booking.php
    │   │   ├── Review.php
    │   │   ├── Favorite.php
    │   │   └── Notification.php
    │   └── Policies/
    ├── database/
    │   └── migrations/
    ├── routes/
    │   └── api.php
    └── config/
        └── cors.php
```

---

## 12. Proximos Passos (Ordem Recomendada)

1. **Criar projeto Laravel** e configurar banco MySQL no Hostinger
2. **Implementar migrations** na ordem: users -> vehicles -> rides -> bookings -> reviews -> favorites -> notifications
3. **Criar Models** com relacionamentos (hasMany, belongsTo, etc)
4. **Implementar AuthController** com Sanctum
5. **Implementar RideController** (CRUD completo)
6. **Implementar BookingController** com notificacoes
7. **Implementar demais controllers** (Favorite, Review, Notification, Vehicle)
8. **Testar todos endpoints** com Postman
9. **Atualizar frontend** para usar API real
10. **Deploy e testes finais**

---

Documento criado para facilitar a implementacao da Fase 6 do CaronAqui.
Qualquer duvida, consulte a documentacao do Laravel 11 e Next.js 14.
