# Plano de execução — Interligar o backend ao CaronAqui

**Projeto:** CaronAqui — caronas na Via Dutra (Rio ↔ São Paulo)
**Frontend:** Next.js 16.2 / React 19 / TypeScript + Tailwind 4 + shadcn (só frontend hoje)
**Backend alvo:** Laravel + MySQL (o contrato já existe em `lib/api.ts` e `docs/API_SPECIFICATION.md`)
**Referência:** backend do Carpoolear (STS-Rosario/carpoolear_backend) — estudar como modelo, não copiar o frontend dele
**Data do plano:** 16/11/2026 — baseado em `PROJETO_DADOS.md`
**Atualização:** 16/11/2026 — Fase 0 verificada no código real (branch `integracao-backend`)

## Regra de ouro do plano

**Contrato primeiro, tela por tela depois.** Nenhuma tela larga o mock enquanto a API dela não existir e não passar no teste. O `NEXT_PUBLIC_USE_MOCK_DATA` continua como chave de emergência: se a API cair, volta o mock — mas nunca os dois misturados na mesma tela.

Ordem das fases: sanear → backend base → viagens/busca → reservas → mapa real → chat/avaliações → admin/pagamento/deploy. Cada fase só começa quando a anterior passa no critério de aceite.

**Decisão registrada (16/11/2026):** manter ESTE arquivo como plano único. Não criar um segundo arquivo de implementação — a Fase 0 abaixo é a atualização verificada do plano, não um plano novo.

---

## Fase 0 — Saneamento e contrato (1–2 dias)

**Objetivo:** deixar o frontend pronto para receber API real e congelar o contrato que o backend vai implementar.

1. **Congelar o contrato da API.** Juntar `lib/api.ts` + `docs/API_SPECIFICATION.md` num único documento: para cada recurso (users, vehicles, rides, bookings, messages, reviews, favorites, notifications, reports), listar endpoint, método, corpo da requisição, resposta e erros. Onde os dois divergirem, vale o `docs/API_SPECIFICATION.md` e o `lib/api.ts` é corrigido.
2. **Corrigir as chamadas quebradas antes de qualquer backend:**
   - `app/dashboard/motorista/[id]/page.tsx` chama `ridesApi.getAllRides()`, que **não existe** em `lib/api.ts` — criar o método ou trocar pela chamada certa.
   - `updateUser` é chamado na edição de perfil mas **não existe** no `AuthContext` — incluir na interface ou remover a chamada.
   - Criar as rotas citadas e inexistentes: `/dashboard/carona/[id]/reservar` e `/dashboard/avaliar/[id]` (mesmo que comecem simples).
   - Cancelar reserva e avaliar hoje são só `console.log` com TODO — transformar em funções que chamam a API (vão falhar até a Fase 3, e está certo que falhem: o erro mostra o que falta).
3. **Separar mock de API no código.** Hoje a busca usa `mockRides` direto e ignora o hook `useRides`. Padronizar: toda tela lê dados por hook (`useRides`, etc.), e o hook decide mock ou API pela `NEXT_PUBLIC_USE_MOCK_DATA`. Nenhuma tela importa `mock-data.ts` diretamente depois desta fase.
4. **Segurança mínima já nesta fase:** `ignoreBuildErrors: true` no `next.config.mjs` vira `false` e os erros de tipo são corrigidos; o `devLogin` e o `/admin/dev-login` só existem com `NODE_ENV !== 'production'` — nunca em produção.
5. **Decidir a hospedagem agora (não no fim):** frontend Next.js dinâmico → Vercel (plano gratuito cobre o início) ou VPS. Backend Laravel + MySQL → Hostinger (PHP + MySQL já existem lá) ou o mesmo VPS. O `.htaccess` estático atual **não serve** para o App Router dinâmico — descartar.
6. **Variáveis de ambiente:** `NEXT_PUBLIC_API_URL` (ex.: `https://api.caronAqui.com.br/api`), `NEXT_PUBLIC_USE_MOCK_DATA=false` em produção, `NEXT_PUBLIC_APP_URL`. Nada de chave de mapa/pagamento no frontend.

**Critério de aceite:** `pnpm build` passa com `ignoreBuildErrors: false`; nenhuma tela importa mock direto; contrato da API documentado e sem divergência entre `lib/api.ts` e a spec.

### Fase 0 — Checklist verificado no código (16/11/2026)

Rodado `tsc --noEmit` no clone da branch `integracao-backend`: **25 erros em 14 arquivos**. Todos abaixo foram confirmados lendo o tipo e o uso. Corrigir nesta ordem (do mais estrutural ao mais pontual):

| # | Arquivo:linha | Erro | Conserto |
| --- | --- | --- | --- |
| 1 | `app/dashboard/motorista/[id]/page.tsx:27` | `getAllRides` não existe em `ridesApi` | Trocar por `ridesApi.list()` (o método existe em `lib/api.ts:155`) |
| 2 | `components/profile/edit-profile-modal.tsx:24` | `updateUser` não existe em `AuthContextType` | Criar o método no contexto (atualiza o usuário local; na Fase 1 vira `PUT /users/profile`) |
| 3 | `app/dashboard/buscar/page.tsx:143,157` | `fullAddress` não existe em `AddressSuggestion` | Trocar por `displayName` (o campo existe no tipo) e completar os campos obrigatórios (`id`, `city`, `state`, `neighborhood`, `street`, `lat`, `lng`, `type`) |
| 4 | `components/home/search-bar.tsx:49,64` | Mesmo `fullAddress` | Mesmo conserto do #3 |
| 5 | `app/dashboard/motorista/[id]/page.tsx:237,241` | `departureTime` não existe em `Ride` | Usar `ride.time` (e `ride.date`); o tipo `Ride` tem `date` + `time`, não `departureTime` |
| 6 | `app/dashboard/motorista/[id]/page.tsx:264` | `pricePerPerson` não existe em `Ride` | Usar `ride.price` (número) |
| 7 | `components/profile/profile-header.tsx:57,58` | `rating` e `totalRides` não existem em `User` | Adicionar `rating?: number; totalRides?: number` ao `User` em `contexts/auth-context.tsx:6` |
| 8 | `components/profile/profile-tabs.tsx:74` | `totalRides` não existe em `User` | Mesmo conserto do #7 |
| 9 | `app/dashboard/favoritos/page.tsx:18` | `isLoggedIn` não existe em `AuthContextType` | Trocar por `isAuthenticated` (o campo existe) |
| 10 | `components/ride-detail/driver-info.tsx:24` | Mesmo `isLoggedIn` | Mesmo conserto do #9 |
| 11 | `app/dashboard/favoritos/page.tsx:20` | `favoriteDriverIds` não existe no contexto | Trocar por `favoriteDrivers` (o campo existe em `contexts/favorite-drivers-context.tsx:6`) |
| 12 | `app/dashboard/favoritos/page.tsx:68,166` | Props `icon/title/description/action` num `div` | O `Empty` de `components/ui/empty.tsx` é só um `div` — reescrever com `EmptyHeader` + `EmptyMedia` + `EmptyTitle` + `EmptyDescription` + `EmptyContent` (com `Button`/`Link` para a ação) |
| 13 | `components/chat/conversation-list.tsx:32` | Mesmo `Empty` com props antigas | Mesmo conserto do #12 |
| 14 | `components/ride-detail/route-map.tsx:43` | `map._container` é privado no Leaflet | Trocar por `map.getContainer()` |
| 15 | `components/maps/search-route-map-content.tsx:61` | Mesmo `_container` | Mesmo conserto do #14 |
| 16 | `components/ride-detail/driver-info.tsx:31` | `'info'` não é `NotificationType` | Adicionar `'info'` ao union em `contexts/notifications-context.tsx:5` |
| 17 | `hooks/use-favorite-driver-notifications.ts:26` | Mesmo `'info'` | Mesmo conserto do #16 |
| 18 | `components/booking/reservation-modal.tsx:87` | `.replace()` chamado num `number` | `ride.price` já é número: trocar `parseInt(ride.price.replace(...))` por `ride.price` |
| 19 | `components/booking/reservation-modal.tsx:260` | `size="sm"` não existe no `Spinner` | Tirar o `size`; o `Spinner` só aceita props de SVG (`className="size-4"` se quiser mudar o tamanho) |
| 20 | `components/admin/admin-users-moderation.tsx:190` | `setSelectedUser(null)` com estado não-nulo | Tipar o estado como `... \| null` |

Depois de corrigir os 20 itens acima, rodar `npx tsc --noEmit` (tem que dar 0 erros) e `pnpm build`, e só então desligar o `ignoreBuildErrors` no `next.config.mjs`.

**Status Fase 0 (concluída na branch `integracao-backend`):** os 20 itens corrigidos; `lib/types.ts` criado como fonte única de tipos (camelCase, com mapeamento snake↔camel em `lib/api.ts`); helpers `formatPrice`/`formatDate` movidos para `lib/format.ts`; `USE_MOCK` centralizado em `lib/config.ts`; telas passaram a ler via hooks (`useRides`, `useRide`, `useMyRides`, `usePopularRoutes`, `useBookings`); rotas `/dashboard/carona/[id]/reservar` e `/dashboard/avaliar/[id]` criadas; `minhas-reservas` e `motorista/[id]` chamam a API em vez de `console.log`; `ignoreBuildErrors: false`; `devLogin` e `/admin/dev-login` gated por `NODE_ENV !== 'production'`; `public/.htaccess` removido; `.env` adicionado ao `.gitignore`. `npx tsc --noEmit` = 0 erros e `pnpm build` verde. `pnpm build` usa `next build --webpack` (next-pwa injeta webpack; Turbopack do Next 16 conflita) e `allowBuilds` libera `sharp` no `pnpm-workspace.yaml`.

---

## Fase 1 — Backend Laravel base: auth + usuários (2–4 dias)

**Objetivo:** um Laravel que responde de verdade, com login que persiste.

1. Criar o projeto Laravel (11.x) + MySQL, seguindo a estrutura do `docs/FASE-6-LARAVEL-INTEGRATION.md`.
2. **Migrations na ordem:** `users` → `vehicles` → `rides` → `bookings` → `messages` → `reviews` → `favorites` → `notifications` → `reports` (a ordem da spec).
3. **Auth com Laravel Sanctum** (token): `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`. Senha com hash, nunca em texto claro. O frontend passa a gravar o token e a sessão **sobrevive ao refresh** — fim do login falso.
4. **Perfil:** `GET /users/{id}` e `PUT /users/profile` (nome, telefone, foto, veículo). O `updateUser` do frontend passa a chamar `PUT /users/profile`.
5. **Seed de desenvolvimento:** 3 usuários + 5 viagens de exemplo na Dutra (Rio → São Paulo, São Paulo → Rio, com paradas em Volta Redonda/Barra Mansa), para testar sem depender do mock.
6. **CORS:** liberar só a origem do frontend (`NEXT_PUBLIC_APP_URL`) e, em dev, `http://localhost:3000`.

**Critério de aceite:** cadastro + login + refresh mantém o usuário logado; `GET /auth/me` devolve o perfil; `pnpm dev` do frontend com `NEXT_PUBLIC_API_URL=http://localhost:8000/api` loga de verdade.

**Status Fase 1 (parcial, commit `dc58dd3`):**
- ✅ 1.1 `backend/` com **Laravel 12** (não 11) + `composer`, `.gitignore`, `README`.
- ✅ 1.2 Migrations UUID na ordem da spec: `users` → `vehicles` → `rides` → `bookings` → `messages` → `reviews` → `favorites` → `notifications` → `reports`.
- ✅ 1.3 Sanctum: register/login/logout/me/refresh (testado: register → login → `GET /auth/me` com token).
- ✅ 1.4 Perfil: `GET /users/{id}`, `GET /users/{id}/reviews`, `PUT /users/profile`.
- ✅ 1.5 Seed dev: 3 usuários + 5 viagens na Dutra (senha `senha12345`).
- ✅ 1.6 CORS restrito a `FRONTEND_URL` + `localhost:3000`.
- ⬜ 1.7 Frontend: `auth-context` ainda usa login fake; falta ligar em `authApi` e persistir `caronaqui_token`.
- ⬜ 1.8 Teste manual de "login sobrevive ao refresh" no frontend.

Pendente para fechar a Fase 1: 1.7 (integrar `auth-context` → `authApi`, gravar token, hidratar via `authApi.me()`, `updateUser` → `usersApi.updateProfile`) e 1.8 (teste). Banco local em SQLite por padrão (`.env`); MySQL só em produção.

---

## Fase 2 — Viagens e busca (3–5 dias)

**Objetivo:** publicar uma carona de verdade e achá-la na busca.

1. **Endpoints de viagens:** `POST /rides` (criar), `GET /rides?from&to&date&seats&max_price` (buscar com filtros), `GET /rides/{id}`, `PATCH /rides/{id}`, `DELETE /rides/{id}` (cancelar), `GET /rides/my` (minhas viagens — spec e `lib/api.ts`).
2. **Regras no backend (nunca só no cliente):** preço mínimo 10, vagas > 0, data no futuro, origem ≠ destino, só o dono edita/cancela a própria viagem. Quando uma viagem é cancelada, as reservas dela são canceladas junto e o passageiro é avisado (Fase 5 usa isso).
3. **Ligar o wizard de publicar:** o `handlePublish` de `/dashboard/publicar` passa a fazer `POST /rides` com os 7 passos. O rascunho em `sessionStorage` continua, mas ao concluir a carona **entra na busca**.
4. **Ligar a busca:** `/dashboard/buscar` passa a usar o hook `useRides` contra `GET /rides`, com os filtros que já existem (preço, período, vagas, pet, bagagem, sem cigarro) enviados como query params. O mock só volta se `NEXT_PUBLIC_USE_MOCK_DATA=true`.
5. **Viagem recorrente:** incluir `is_regular` + `weekdays` (já existem no tipo `CreateRideData`) no wizard e no backend.
6. **Detalhe da carona:** `/dashboard/carona/[id]` lê `GET /rides/{id}` — motorista, vagas restantes, preço, confortos.

**Critério de aceite:** publicar uma viagem no navegador A e encontrá-la na busca do navegador B; cancelar a viagem some da busca; duas pessoas diferentes veem os mesmos dados.

---

## Fase 3 — Reservas (2–4 dias)

**Objetivo:** reserva que existe para os dois lados.

1. **Endpoints:** `POST /rides/{id}/bookings` (reservar N assentos), `GET /bookings/mine`, `PATCH /bookings/{id}/cancel` (passageiro cancela), `PATCH /bookings/{id}/confirm` (motorista confirma — opcional, decidir nesta fase).
2. **Regra de vagas no backend:** a reserva só confirma se `vagas_restantes >= assentos_pedidos`, com trava de concorrência (transação/lock na linha da viagem). Dois passageiros não podem reservar o último assento ao mesmo tempo.
3. **Ligar o fluxo:** o modal de reserva chama `POST /bookings`; a tela de confirmado lê a reserva real; `/dashboard/minhas-reservas` lê `GET /bookings/mine` (hoje mostra lista fixa e ignora a reserva pendente — apagar a lista fixa).
4. **Cancelar de verdade:** o botão de cancelar chama `PATCH /bookings/{id}/cancel` e devolve as vagas. O `localStorage` `caronaqui_pending_booking` deixa de existir.
5. **Avaliar a partir da reserva:** `POST /reviews` (nota + comentário; a spec **não** tem `/bookings/{id}/review`) e a rota `/dashboard/avaliar/[id]` passa a existir. A avaliação aparece no perfil do motorista.

**Critério de aceite:** reservar 1 assento reduz as vagas em 1 para todo mundo; cancelar devolve a vaga; a reserva aparece em "Minhas reservas" depois de um refresh.

---

## Fase 4 — Mapa e rota de verdade (2–3 dias)

**Objetivo:** trocar a linha reta por rota de estrada, com paradas.

1. **Rota real com OSRM (gratuito, igual ao Carpoolear):** o backend (ou o frontend, via `lib/route-calculation.ts`) consulta o OSRM com origem, destino e waypoints e devolve a polilinha da estrada, distância e tempo reais. Nada de Google Directions — custo zero.
2. **Paradas no wizard:** incluir o passo de waypoints em `/dashboard/publicar` (o tipo `RouteStop` já existe, mas o wizard não coleta). Paradas sugeridas na Dutra: Volta Redonda, Barra Mansa, Resende, Queluz, Aparecida, Guaratinguetá, Taubaté, São José dos Campos.
3. **Busca de endereço:** manter a lista local de cidades da Dutra + Nominatim como fallback, mas geocodificar no backend e guardar `lat/lng` da origem, do destino e de cada parada — o mapa passa a ler coordenadas salvas, não texto.
4. **Mapa da carona:** `/dashboard/carona/[id]/mapa` mostra rota de estrada + marcadores de origem, paradas e destino, com distância e tempo do OSRM (substituindo o Haversine a 80 km/h).
5. **Busca por trecho:** passageiro que busca "Taubaté → São Paulo" encontra carona "Rio → São Paulo" que passa por Taubaté (a viagem tem a parada no caminho). Isso é o diferencial do app — decidir nesta fase se entra agora ou na Fase 7.

**Critério de aceite:** a rota desenhada segue a Dutra (não uma reta); publicar com 2 paradas mostra as 3 marcas no mapa; distância/tempo batem com a realidade da rodovia.

---

## Fase 5 — Chat, avaliações e notificações (3–5 dias)

**Objetivo:** motorista e passageiro se falam de verdade, e o app avisa.

1. **Chat:** `POST /rides/{id}/messages` e `GET /messages?ride_id=` (ou por conversa). Começar com polling via SWR a cada 10–15 s — WebSocket fica para depois do MVP, porque exige VPS e muda a hospedagem. O `messages-context.tsx` passa a ler da API; as 2 conversas fixas são apagadas.
2. **Avaliações:** `GET /users/{id}/reviews` alimenta o perfil (hoje são 3 reviews fixos). Média e contagem calculadas no backend.
3. **Notificações in-app:** `GET /notifications` + `PATCH /notifications/{id}/read`. Eventos reais: reserva criada, reserva cancelada, viagem cancelada, mensagem nova, avaliação recebida. O `localStorage` `caronaqui_notifications` deixa de ser a fonte.
4. **Notificação fora do app (depois do MVP):** push (service worker já existe, falta `pushManager` + servidor de push), e-mail transacional e WhatsApp ficam para a Fase 7 — não travam o lançamento.
5. **Favoritos:** `POST/DELETE /favorites` (caronas e motoristas) substituindo o `localStorage`.

**Critério de aceite:** mensagem enviada no navegador A aparece no B sem refresh manual (no polling); reserva gera notificação real para o motorista.

---

## Fase 6 — Admin real, pagamento e produção (4–7 dias)

**Objetivo:** tirar o "Em desenvolvimento", cobrar sem intermediário inseguro e publicar.

1. **Admin de verdade:** `GET /admin/users`, `GET /admin/rides`, `GET /admin/reports` (denúncias) com aprovar/reprovar/bloquear persistidos. Os KPIs e o gráfico do dashboard passam a ler do banco. **Proteger no backend:** só `role=admin` acessa — a proteção de hoje é só no cliente e o papel vem de uma sessão falsa.
2. **Verificação de documento/CNH:** upload de CNH + selfie, com status `pendente/aprovado/reprovado` e selo real no perfil. Sem isso, os selos "verificado" continuam sendo maquiagem.
3. **Pagamento (decisão de produto):** hoje o copy diz "pague por Pix, direto, sem intermediário" — sem chave, sem QR, sem confirmação. Duas opções: **(a)** MVP — o motorista cadastra a chave Pix e o app mostra o QR na tela de confirmado (sem intermediar o dinheiro); **(b)** gateway (Mercado Pago/Stripe) com split e retenção — mais seguro, mais trabalho e com taxa. Recomendado: (a) no lançamento, (b) depois.
4. **Remover o mock por completo:** `NEXT_PUBLIC_USE_MOCK_DATA` some do código; `lib/mock-data.ts` vira apenas seed de testes. `typescript.ignoreBuildErrors` já está `false` desde a Fase 0.
5. **LGPD mínimo:** termos de uso + política de privacidade, exclusão de conta (`DELETE /users/me`), e nenhum dado de documento em log.
6. **Deploy:** frontend na Vercel (variáveis `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_APP_URL` apontando para produção), Laravel + MySQL na Hostinger ou VPS, backup do banco, `APP_DEBUG=false`, HTTPS obrigatório, e teste fim a fim: cadastro → publicar → buscar → reservar → chat → avaliar, em dois celulares diferentes.

**Critério de aceite:** um estranho consegue usar o app de ponta a ponta sem você; nenhum dado falso aparece em nenhuma tela; admin bloqueia um usuário e o bloqueio vale de verdade.

---

## Resumo das fases

| Fase | Entrega | Tempo estimado |
| --- | --- | --- |
| 0 | Contrato congelado, chamadas quebradas corrigidas, build limpo | 1–2 dias |
| 1 | Laravel + Sanctum + usuários, login que persiste | 2–4 dias |
| 2 | Publicar e buscar de verdade | 3–5 dias |
| 3 | Reservas com trava de vagas + cancelamento | 2–4 dias |
| 4 | Rota de estrada (OSRM) + paradas no wizard | 2–3 dias |
| 5 | Chat, avaliações e notificações reais | 3–5 dias |
| 6 | Admin, verificação, Pix e produção | 4–7 dias |
| **Total** | **MVP usável por estranhos** | **~3–5 semanas** |

## O que NÃO fazer

- Não reescrever o frontend em Vue para copiar o Carpoolear — o seu já está pronto e melhor.
- Não começar pelo pagamento ou pelo chat em tempo real — são as partes mais caras e as que menos importam no dia 1.
- Não publicar com login falso, dev-login ou `ignoreBuildErrors: true` — é o mesmo erro que o Relica tinha.
- Não prometer "rota em tempo real com trânsito" no MVP — OSRM dá rota e tempo estimado, trânsito ao vivo é outro projeto.
