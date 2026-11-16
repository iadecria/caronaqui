# PROJETO_DADOS.md

Documento gerado só a partir do código e dos arquivos deste repositório. Nada aqui foi inventado como se já estivesse funcionando. Onde um arquivo descreve um plano (docs), isso está marcado como documentação, não como implementação.

Legenda: **[EXISTE]** implementado e usado de verdade · **[PARCIAL]** existe, mas incompleto ou não ligado ao fluxo real · **[MOCK]** só visual ou falso · **[NÃO EXISTE]** não há implementação no código.

---

## 1. VISÃO GERAL

- **Nome:** CaronAqui. `package.json` ainda chama o pacote de `my-project` (versão `0.1.0`).
- **Objetivo (texto do app):** encontrar e oferecer caronas na Via Dutra, entre Rio de Janeiro e São Paulo. Metadata em `app/layout.tsx`: "Caronas Via Dutra".
- **O que o repositório é hoje:** frontend Next.js. Não há pasta de backend, banco, migrations, Docker ou rotas `app/api`.

### Stack que está no código

| Item | Status | O que existe |
| --- | --- | --- |
| Linguagem | [EXISTE] | TypeScript |
| Framework | [EXISTE] | Next.js `16.2.0` (App Router), React 19 |
| UI | [EXISTE] | Tailwind CSS 4, Radix/shadcn, Lucide |
| Estado | [EXISTE] | Contextos React no cliente |
| Dados | [MOCK] | `lib/mock-data.ts` e arrays locais nas páginas |
| Cliente HTTP | [PARCIAL] | `lib/api.ts` descreve uma API Laravel; quase nenhuma tela chama esses métodos |
| Banco | [NÃO EXISTE] | Nenhum ORM, SQL ou schema executável no repo |
| Auth real | [NÃO EXISTE] | Login aceita qualquer e-mail/senha e monta um usuário falso |
| PWA | [PARCIAL] | `next-pwa`, `public/manifest.json`, `public/sw.js`, prompt de instalação e indicador offline |
| Analytics | [PARCIAL] | `@vercel/analytics` só quando `NODE_ENV === 'production'` |
| Hospedagem no código | [NÃO EXISTE] | Não há `vercel.json`, Dockerfile nem script de deploy. Docs falam em Hostinger; `.htaccess` em `public/` é de Apache estático |

### Estrutura de pastas (o que existe)

- `app/` — páginas (pública, dashboard, admin)
- `components/` — UI, busca, publicação, mapa, chat, perfil, admin, PWA
- `contexts/` — auth, reserva, mensagens, notificações, favoritos, rascunho de publicação
- `hooks/` — busca de endereço, API/SWR, PWA, mobile
- `lib/` — mock, cliente HTTP, cálculo de rota, cidades da Dutra, textos
- `docs/` — especificação de API e guia de integração Laravel (plano, não código)
- `public/` — ícones, manifest, service worker, `.htaccess`

### Telas / rotas

20 arquivos de página. Não há rotas de API.

1. `/`
2. `/dashboard` (só redireciona para `/dashboard/buscar`)
3. `/dashboard/buscar`
4. `/dashboard/publicar`
5. `/dashboard/perfil`
6. `/dashboard/favoritos`
7. `/dashboard/notificacoes`
8. `/dashboard/minhas-reservas`
9. `/dashboard/mensagens`
10. `/dashboard/mensagens/[id]`
11. `/dashboard/motorista/[id]`
12. `/dashboard/carona/[id]`
13. `/dashboard/carona/[id]/mapa`
14. `/dashboard/carona/[id]/confirmado`
15. `/admin`
16. `/admin/usuarios`
17. `/admin/viagens`
18. `/admin/denuncias`
19. `/admin/configuracoes`
20. `/admin/dev-login`

A página de mapa navega para `/dashboard/carona/[id]/reservar`. Essa rota **não existe** no `app/`.

---

## 2. AUTENTICAÇÃO E PERFIL

- **Login e cadastro na interface:** [EXISTE] modal com nome, e-mail e senha (`components/login-modal.tsx`).
- **Como é feito de verdade:** [MOCK]. `contexts/auth-context.tsx` espera um timeout e, se os campos não estão vazios, cria um usuário em memória. Não chama `authApi`. Não grava token. A sessão some no refresh (não há persistência do usuário).
- **Google / OAuth / telefone como login:** [NÃO EXISTE]. Telefone é campo de perfil, não método de login.
- **Login de desenvolvimento:** [EXISTE] `devLogin` com papéis `user`, `admin` e `dev`. O botão aparece no modal quando não é produção.
- **Papéis:** [PARCIAL] o tipo tem `user | admin | dev`. Não há contas separadas de motorista e passageiro. A mesma pessoa publica carona e reserva.
- **Perfil:** [PARCIAL] tela `/dashboard/perfil` com header, abas, conquistas e avaliações. Avaliações da aba são array fixo em `components/profile/profile-tabs.tsx` [MOCK].
- **Editar perfil:** [PARCIAL] o modal simula delay e chama `updateUser`. Esse método **não está** na interface de `AuthContext` lida em `contexts/auth-context.tsx`.
- **Verificação de telefone / documento / CNH:** [MOCK]. Flags `verifiedPhone` e `verifiedId` vêm do usuário falso e aparecem como selos. Não há upload de CNH, selfie ou fluxo de validação real. O admin mostra "documento" como emoji, não como arquivo.

---

## 3. VIAGENS (MOTORISTA)

- **Formulário de criar viagem:** [EXISTE] wizard de 7 passos em `/dashboard/publicar`: origem, destino, data/hora, vagas + modelo/cor do carro, preço, confortos (pet, cigarro, bagagem, descrição), revisão.
- **Publicar de verdade:** [MOCK]. `handlePublish` só espera 1,5 s e mostra sucesso. O rascunho fica em `sessionStorage` (`caronaqui_publish_draft`) e é apagado ao concluir. A carona não entra na busca.
- **Origem, destino, data/hora, vagas, preço por assento:** [EXISTE] no formulário. Preço mínimo validado no cliente: 10.
- **Editar viagem publicada:** [NÃO EXISTE] na UI. `ridesApi.update` existe só no cliente HTTP, e nenhuma página o usa.
- **Cancelar viagem:** [NÃO EXISTE] na UI. `ridesApi.cancel` também não é chamado.
- **Viagem recorrente:** [NÃO EXISTE] no formulário. O tipo `CreateRideData` em `lib/api.ts` tem `is_regular` e `weekdays`, mas o wizard não coleta isso.
- **Lista "minhas viagens":** [NÃO EXISTE].

---

## 4. BUSCA E RESERVA (PASSAGEIRO)

- **Busca por origem, destino e data:** [EXISTE] na UI de `/dashboard/buscar`.
- **Fonte dos resultados:** [MOCK] `mockRides` de `lib/mock-data.ts`. O hook `useRides` (`hooks/use-api.ts`) sabe filtrar mock ou chamar `/rides`, mas a página de busca **não usa** esse hook.
- **Filtros:** [EXISTE] no cliente: faixa de preço (0–200), período do dia, vagas mínimas, pet, bagagem, sem cigarro. Ordenação por preço, horário ou nota.
- **Reservar assento:** [PARCIAL] / [MOCK]. Modal e `BookingContext.completeBooking` simulam 1 s de API e redirecionam para a tela de confirmado. A reserva pendente vai para `localStorage` (`caronaqui_pending_booking`) só até o login. Não cria registro. `/dashboard/minhas-reservas` mostra uma lista fixa e **não** lê essa reserva.
- **Cancelar reserva:** [NÃO EXISTE] de fato. O botão só faz `console.log` com um TODO.
- **Avaliar a partir da reserva:** [NÃO EXISTE]. `handleRate` também só faz `console.log`. A notificação aponta para `/dashboard/avaliar/r3`, rota que **não existe**.

---

## 5. MAPA E ROTA

- **Mapa:** [EXISTE]. Biblioteca: **Leaflet** + `react-leaflet`. Tiles do OpenStreetMap. Não há Google Maps nem Mapbox no `package.json`.
- **Onde aparece:** preview na publicação, mapa da busca, detalhe da carona e `/dashboard/carona/[id]/mapa`.
- **Partida e chegada:** [EXISTE] marcadores de origem e destino.
- **Rota desenhada:** [PARCIAL]. A linha é interpolação reta entre os pontos (`lib/route-calculation.ts` e polylines nos componentes). Não é uma rota de estrada (sem OSRM, Directions API ou similar).
- **Paradas intermediárias:** [PARCIAL]. O tipo `RouteStop` e o mapa detalhado desenham `ride.stops` quando o mock traz paradas. O wizard de publicar **não** pede waypoints.
- **Busca de endereço:** [PARCIAL]. Lista local de cidades/pontos da Via Dutra (`lib/cities-abbreviations.ts`) e, se não achar, consulta Nominatim (`https://nominatim.openstreetmap.org/search`).
- **Distância e tempo:** [PARCIAL] Haversine em km e tempo estimado a 80 km/h. Não é tempo de trânsito real.

---

## 6. PAGAMENTO

- **Pagamento dentro do app:** [NÃO EXISTE]. Não há Stripe, Mercado Pago, SDK de Pix, checkout nem webhook.
- **Texto de produto:** [MOCK] / copy. `lib/identity.ts` diz para pagar o motorista por Pix, "direto, sem intermediário". Não há campo de chave Pix, QR Code nem confirmação de pagamento.
- **Preço:** [EXISTE] só como número na carona e no total da reserva simulada.

---

## 7. CHAT E AVALIAÇÕES

- **Chat:** [MOCK]. `contexts/messages-context.tsx` começa com 2 conversas e mensagens fixas. Enviar mensagem altera só o estado da aba. Não usa `messagesApi`. Não há tempo real.
- **Avaliação por estrelas/comentário:** [MOCK] na visualização do perfil (3 reviews fixos) e nas notas dos motoristas do mock. `reviewsApi.create` não é chamado. Não há tela de avaliar.
- **Confiança / verificação:** [MOCK] selos de telefone e identidade. Admin tem níveis "Novato" / "Confiável" em usuários inventados. Conquistas (`components/achievements`) são locais, sem regra ligada a viagens reais.

---

## 8. NOTIFICAÇÕES

- **Lista in-app:** [MOCK] + persistência local. Cinco notificações iniciais; depois grava em `localStorage` (`caronaqui_notifications`). Marcar como lida funciona só nesse armazenamento.
- **Push:** [NÃO EXISTE]. Não há `Notification.requestPermission` nem `pushManager` no código da aplicação.
- **E-mail, SMS, WhatsApp:** [NÃO EXISTE].
- **O que "dispara":** nada de servidor. Tipos previstos na UI: reserva, mensagem, lembrete, avaliação, sistema. São textos prontos, não eventos reais. Favoritar motorista tem um hook (`use-favorite-driver-notifications.ts`) que olha a lista local de caronas.

---

## 9. ADMIN

- **Painel:** [EXISTE] como interface em `/admin`, protegida no cliente pelo papel `admin` ou `dev` da sessão mock.
- **Dashboard:** [MOCK] KPIs, gráfico e viagens recentes hardcoded em `components/admin/admin-dashboard.tsx`.
- **Usuários:** [MOCK] três usuários fixos; aprovar/reprovar muda só o estado da página.
- **Viagens:** [NÃO EXISTE] além do texto "Em desenvolvimento...".
- **Denúncias:** [NÃO EXISTE] além do texto "Em desenvolvimento...".
- **Taxas / preços:** [PARCIAL] formulário de valor por km, margem e "zona vermelha". Salvar só mostra "salvo" por 3 segundos. Não persiste.
- **Acesso dev:** [EXISTE] `/admin/dev-login` entra com o usuário admin falso.

---

## 10. BANCO DE DADOS

- **Tabelas/modelos no projeto:** [NÃO EXISTE]. Nenhum schema, migration, Prisma, Drizzle ou SQL fora da documentação.
- **O que o app guarda no navegador:**
  - `localStorage`: favoritos de caronas, motoristas favoritos, notificações, reserva pendente
  - `sessionStorage`: rascunho de publicação, redirect e ação pendente de login
  - memória: usuário logado, chat, reservas da tela "minhas reservas"
- **Documentado, mas não criado** em `docs/API_SPECIFICATION.md`: `users`, `vehicles`, `rides`, `bookings`, `messages`, `reviews`, `favorites`, `notifications`, `reports`.

O que ainda não existe como dado real: usuários, viagens publicadas, reservas, mensagens, avaliações, denúncias, pagamentos, verificação de documento.

---

## 11. DEPLOY E AMBIENTE

- **Onde está hospedado, segundo o repo:** [NÃO EXISTE] configuração de produção. Não há VPS, projeto Vercel ou Hostinger ligados no código.
- **Intenção escrita nos docs:** `docs/FASE-6-LARAVEL-INTEGRATION.md` e `docs/PWA-TESTING.md` descrevem frontend estático + Laravel + MySQL na Hostinger. Isso é guia, com checklists não marcados. `next.config.mjs` diz que `output: 'export'` foi removido para permitir rotas dinâmicas, então o app atual é servidor Next, não export estático.
- **Como sobe:** [PARCIAL] scripts `dev`, `build`, `start`, `lint`. Sem Docker. `public/.htaccess` reescreve tudo para `index.html` (padrão de hospedagem Apache estática), incompatível com o App Router dinâmico atual.
- **PWA no build:** `next-pwa` desliga o service worker quando `NODE_ENV === 'development'`.

### Variáveis (somente nomes)

Usadas no código:

- `NEXT_PUBLIC_API_URL` — base da API; se faltar, o cliente usa `http://localhost:8000/api`
- `NEXT_PUBLIC_USE_MOCK_DATA` — o hook `use-api` só entra em mock se o valor for exatamente `true`. As telas principais usam mock direto, sem olhar essa variável
- `NODE_ENV`

Só no `.env.example`, sem leitura no código:

- `NEXT_PUBLIC_APP_URL`

Não há outras chaves de mapa, pagamento ou auth no código.

---

## 12. O QUE FALTA

Incompleto, quebrado ou placeholder:

- Quase todo fluxo de negócio é simulado. Publicar, reservar, login e chat não gravam em lugar compartilhado.
- `lib/api.ts` e `hooks/use-api.ts` não estão ligados às telas que o usuário usa. `NEXT_PUBLIC_USE_MOCK_DATA` não controla a busca.
- `app/dashboard/motorista/[id]/page.tsx` chama `ridesApi.getAllRides()`, método que **não existe** em `lib/api.ts`.
- Editar perfil chama `updateUser`, que não está no contexto de auth.
- Cancelar reserva, avaliar e abrir chat a partir de "Minhas reservas" são TODOs com `console.log`.
- Rotas citadas e inexistentes: `/dashboard/avaliar/...`, `/dashboard/carona/[id]/reservar`.
- Admin de viagens e denúncias é texto "Em desenvolvimento".
- Não há backend Laravel neste repositório, apesar dos docs.
- Não há pagamento, push, e-mail, SMS, WhatsApp, CNH, edição/cancelamento de viagem, viagem recorrente nem rota real de estrada.
- Sessão não sobrevive a reload.
- `typescript.ignoreBuildErrors: true` no `next.config.mjs` esconde erro de tipo no build.

Próximo passo lógico: um backend de verdade (o contrato já está esboçado em `lib/api.ts` e `docs/API_SPECIFICATION.md`) com usuários, viagens e reservas persistidos, e trocar os mocks das telas de busca, publicar e reservar por essas chamadas. Sem isso, o app não é usável por duas pessoas.

---

## Resumo em 5 linhas

1. O projeto já é um frontend Next.js (CaronAqui) com landing, busca filtrável, mapa Leaflet, wizard de publicar, chat, perfil, notificações locais e um admin visual.
2. De verdade, ele só navega e mostra dados falsos de `lib/mock-data.ts` e listas fixas; login aceita qualquer senha e não persiste.
3. Publicar carona e reservar assento só simulam sucesso; a carona nova não aparece na busca e a reserva não aparece em Minhas reservas.
4. Não há banco, pagamento, verificação de documento, push/e-mail/SMS nem rota real de estrada neste repositório.
5. Para virar um app de caronas usável, o próximo passo é persistir usuário, viagem e reserva num backend e ligar as telas que hoje ignoram `lib/api.ts`.
