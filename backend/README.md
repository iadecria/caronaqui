# CaronAqui — Backend (Laravel 12)

API do CaronAqui, responsável por autenticação, viagens, reservas, mensagens, avaliações, favoritos e notificações.

## Stack

- PHP 8.2+
- Laravel 12
- Laravel Sanctum (tokens de API)
- MySQL (produção) / SQLite (desenvolvimento local, padrão)

## Como rodar (desenvolvimento)

```bash
cd backend

# 1. Dependências
composer install

# 2. Ambiente
cp .env.example .env
php artisan key:generate

# 3. Banco (SQLite por padrão; para MySQL ajuste DB_* no .env)
php artisan migrate

# 4. Servidor
php artisan serve --port=8000
```

A API sobe em `http://127.0.0.1:8000/api`.

No frontend, configure `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api` e `NEXT_PUBLIC_USE_MOCK_DATA=false`.

## Variáveis de ambiente relevantes

- `APP_URL` — URL do backend
- `FRONTEND_URL` — origem liberada no CORS (padrão `http://localhost:3000`)
- `DB_CONNECTION` / `DB_*` — `sqlite` (padrão) ou `mysql`

## Endpoints implementados

### Autenticação
- `POST /api/auth/register` — cria conta e devolve `{ user, token }`
- `POST /api/auth/login` — devolve `{ user, token }`
- `POST /api/auth/logout` — (auth) revoga o token atual
- `GET  /api/auth/me` — (auth) usuário logado
- `POST /api/auth/refresh` — (auth) troca o token atual por um novo

### Usuários
- `GET /api/users/{id}` — perfil público
- `GET /api/users/{id}/reviews` — avaliações recebidas
- `PUT /api/users/profile` — (auth) atualiza nome/telefone/avatar/gênero

## Estrutura do banco

Migrations na ordem da spec (`docs/API_SPECIFICATION.md`): `users` → `vehicles` → `rides` → `bookings` → `messages` → `reviews` → `favorites` + `notifications` → `reports`. Todas as chaves primárias são UUID.

## Status

- Fase 1: base + migrations + auth Sanctum + perfil (em andamento)
- Próximo: seed de dev (3 usuários + 5 viagens na Dutra), endpoints de viagens/reservas, integração do `auth-context` do frontend
