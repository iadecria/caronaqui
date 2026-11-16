# CaronAqui PWA - Diretrizes Mobile-First

## Visao Geral

Este documento define as diretrizes tecnicas para implementacao do layout mobile-first do CaronAqui como Progressive Web App (PWA). O foco e criar uma experiencia nativa em dispositivos moveis, priorizando performance, usabilidade e suporte offline.

---

## 1. Arquitetura Mobile-First

### 1.1 Principio Base

```
Mobile -> Tablet -> Desktop
```

Todo CSS deve ser escrito primeiro para mobile (320px-480px), depois expandido para telas maiores usando media queries `min-width`.

### 1.2 Breakpoints Padrao

```css
/* Mobile first - base styles (< 640px) */
.component { /* estilos mobile */ }

/* Tablet (640px+) */
@media (min-width: 640px) { /* sm: */ }

/* Tablet landscape / Desktop pequeno (768px+) */
@media (min-width: 768px) { /* md: */ }

/* Desktop (1024px+) */
@media (min-width: 1024px) { /* lg: */ }

/* Desktop grande (1280px+) */
@media (min-width: 1280px) { /* xl: */ }
```

### 1.3 Tailwind CSS - Classes Mobile-First

```tsx
// CORRETO: Mobile-first
<div className="flex flex-col md:flex-row md:items-center">

// INCORRETO: Desktop-first (evitar)
<div className="flex flex-row max-md:flex-col">
```

---

## 2. Layout com Flexbox e Grid

### 2.1 Hierarquia de Escolha

1. **Flexbox** - Layouts unidimensionais (navegacao, cards em linha, headers)
2. **Grid** - Layouts bidimensionais complexos (grids de cards, dashboards)
3. **Posicionamento absoluto** - Apenas para overlays, badges, tooltips

### 2.2 Padroes de Layout Mobile

#### App Shell (Layout Principal)

```tsx
// components/app-shell.tsx
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen min-h-[100dvh]">
      {/* Header fixo no topo */}
      <header className="sticky top-0 z-50 h-14 bg-card border-b">
        <Header />
      </header>

      {/* Conteudo principal - flex-1 ocupa espaco restante */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom Nav fixo - apenas mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <BottomNav />
      </nav>
    </div>
  )
}
```

#### Grid de Cards Responsivo

```tsx
// Mobile: 1 coluna | Tablet: 2 colunas | Desktop: 3 colunas
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {rides.map(ride => <RideCard key={ride.id} ride={ride} />)}
</div>
```

#### Flexbox para Navegacao

```tsx
// Bottom Navigation - distribuicao igual
<nav className="flex items-center justify-around h-16 bg-card border-t">
  {navItems.map(item => (
    <NavItem key={item.href} {...item} />
  ))}
</nav>
```

### 2.3 Safe Areas (Notch e Home Indicator)

```css
/* globals.css */
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
}

/* Aplicar no Bottom Navigation */
.bottom-nav {
  padding-bottom: max(12px, var(--safe-area-inset-bottom));
}
```

```tsx
// Componente com safe area
<nav className="pb-[max(12px,env(safe-area-inset-bottom))]">
```

---

## 3. Navegacao Adaptavel

### 3.1 Estrutura de Navegacao

| Viewport | Componente | Comportamento |
|----------|------------|---------------|
| Mobile (<768px) | BottomNav | Fixo no bottom, 5 itens max |
| Desktop (>=768px) | Sidebar | Fixa na lateral esquerda |

### 3.2 Bottom Navigation (Mobile)

```tsx
// Maximo 5 itens para touch targets adequados
const navItems = [
  { label: "Inicio", href: "/dashboard", icon: Home },
  { label: "Buscar", href: "/dashboard/buscar", icon: Search },
  { label: "Publicar", href: "/dashboard/publicar", icon: PlusCircle, highlight: true },
  { label: "Reservas", href: "/dashboard/minhas-reservas", icon: Ticket },
  { label: "Perfil", href: "/dashboard/perfil", icon: User },
]

// Touch targets minimos: 44x44px (Apple) ou 48x48px (Material Design)
<button className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] p-2">
  <Icon className="h-6 w-6" />
  <span className="text-xs mt-1">{label}</span>
</button>
```

### 3.3 Gestos e Interacoes Touch

```tsx
// Swipe para voltar (opcional)
import { useSwipeable } from 'react-swipeable'

const handlers = useSwipeable({
  onSwipedRight: () => router.back(),
  trackMouse: false,
  delta: 50,
})

// Pull-to-refresh
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh'
```

### 3.4 Transicoes de Pagina

```tsx
// Transicoes suaves para sensacao nativa
<main className="animate-in fade-in slide-in-from-right-4 duration-200">
  {children}
</main>
```

---

## 4. Imagens Otimizadas

### 4.1 Next.js Image Component

```tsx
import Image from 'next/image'

// SEMPRE usar next/image para otimizacao automatica
<Image
  src={driver.avatar}
  alt={driver.name}
  width={48}
  height={48}
  className="rounded-full object-cover"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>
```

### 4.2 Configuracao next.config.mjs para Export Estatico

```js
// next.config.mjs
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Necessario para export estatico
  },
}
```

### 4.3 Formatos e Tamanhos

| Contexto | Tamanho | Formato | Qualidade |
|----------|---------|---------|-----------|
| Avatar pequeno | 48x48 | WebP | 80% |
| Avatar grande | 96x96 | WebP | 85% |
| Card thumbnail | 120x80 | WebP | 75% |
| Hero/Banner | 640x360 | WebP | 85% |
| Logo | SVG | SVG | - |

### 4.4 Lazy Loading e Placeholder

```tsx
// Skeleton placeholder durante carregamento
<div className="relative">
  {!imageLoaded && (
    <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
  )}
  <Image
    src={src}
    alt={alt}
    onLoad={() => setImageLoaded(true)}
    className={cn(
      "transition-opacity duration-300",
      imageLoaded ? "opacity-100" : "opacity-0"
    )}
  />
</div>
```

---

## 5. Performance

### 5.1 Core Web Vitals Targets

| Metrica | Target | Descricao |
|---------|--------|-----------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |
| TTFB | < 800ms | Time to First Byte |

### 5.2 Code Splitting

```tsx
// Lazy loading de componentes pesados
import dynamic from 'next/dynamic'

const RouteMap = dynamic(
  () => import('@/components/ride-detail/route-map'),
  { 
    loading: () => <MapSkeleton />,
    ssr: false // Leaflet nao funciona no SSR
  }
)

// Lazy loading de paginas
const SearchFilters = dynamic(
  () => import('@/components/search/search-filters')
)
```

### 5.3 Bundle Size

```bash
# Analisar bundle
pnpm add -D @next/bundle-analyzer

# next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(nextConfig)
```

### 5.4 Prefetch e Preload

```tsx
// Prefetch de rotas provaveis
import Link from 'next/link'

<Link href="/dashboard/buscar" prefetch={true}>
  Buscar caronas
</Link>

// Preload de fontes criticas
<link
  rel="preload"
  href="/fonts/plus-jakarta-sans.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

### 5.5 Debounce e Throttle

```tsx
// Debounce em inputs de busca
import { useDebouncedCallback } from 'use-debounce'

const debouncedSearch = useDebouncedCallback(
  (value: string) => setSearchTerm(value),
  300
)

// Throttle em scroll handlers
import { useThrottledCallback } from 'use-debounce'

const throttledScroll = useThrottledCallback(
  () => handleScroll(),
  100
)
```

---

## 6. Suporte Offline (PWA)

### 6.1 Service Worker com next-pwa

```bash
pnpm add next-pwa
```

```js
// next.config.mjs
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      urlPattern: /^https:\/\/api\.caronaqui\.com\.br\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
  ],
})

module.exports = withPWA(nextConfig)
```

### 6.2 Manifest.json

```json
// public/manifest.json
{
  "name": "CaronAqui - Caronas Via Dutra",
  "short_name": "CaronAqui",
  "description": "Caronas do Rio a SP pela Via Dutra",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f5f5f5",
  "theme_color": "#50C878",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 6.3 Meta Tags PWA

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CaronAqui',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#50C878',
}
```

### 6.4 Indicador de Status Offline

```tsx
// hooks/use-online-status.ts
'use client'

import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true // SSR fallback
  )
}

// Componente de indicador
export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  
  if (isOnline) return null
  
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white text-center py-2 text-sm">
      Voce esta offline. Algumas funcoes podem nao funcionar.
    </div>
  )
}
```

### 6.5 Cache de Dados com SWR

```tsx
// Dados ficam em cache e funcionam offline
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useRides() {
  const { data, error, isLoading, mutate } = useSWR('/api/rides', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minuto
    fallbackData: getCachedRides(), // Dados em localStorage
  })

  return { rides: data, error, isLoading, refresh: mutate }
}
```

---

## 7. Testes em Dispositivos Moveis

### 7.1 Dispositivos de Teste Prioritarios

| Prioridade | Dispositivo | Resolucao | Navegador |
|------------|-------------|-----------|-----------|
| Alta | iPhone 14 | 390x844 | Safari |
| Alta | Samsung Galaxy S23 | 360x780 | Chrome |
| Media | iPhone SE | 375x667 | Safari |
| Media | Pixel 7 | 412x915 | Chrome |
| Media | iPad | 768x1024 | Safari |
| Baixa | Galaxy Fold | 280x653 | Chrome |

### 7.2 Chrome DevTools - Device Mode

```bash
# Atalho para abrir DevTools
Cmd/Ctrl + Shift + I

# Ativar device mode
Cmd/Ctrl + Shift + M
```

**Checklist de Testes:**
- [ ] Touch targets >= 44px
- [ ] Texto legivel sem zoom (min 16px para inputs)
- [ ] Scroll suave sem travamentos
- [ ] Orientacao portrait e landscape
- [ ] Keyboard nao cobre inputs
- [ ] Safe areas respeitadas (notch, home indicator)

### 7.3 Lighthouse Mobile Audit

```bash
# Via CLI
npx lighthouse https://caronaqui.com.br --view --preset=perf

# Targets minimos:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 90+
# SEO: 90+
# PWA: 100
```

### 7.4 Testes de Gesto

| Gesto | Acao Esperada | Componente |
|-------|---------------|------------|
| Tap | Selecao/Navegacao | Botoes, links, cards |
| Long press | Menu contextual | Cards de carona |
| Swipe horizontal | Carousel, dismiss | Rotas populares |
| Swipe vertical | Scroll | Listas |
| Pull down | Refresh | Listas principais |
| Pinch | Zoom (desabilitado) | Global |

### 7.5 Testes de Conectividade

```bash
# Chrome DevTools > Network > Throttling
- Slow 3G (400ms latency, 400kb/s down)
- Fast 3G (100ms latency, 1.5mb/s down)
- Offline

# Verificar:
- [ ] App carrega com cache offline
- [ ] Indicador offline aparece
- [ ] Acoes offline sao enfileiradas
- [ ] Sincronizacao ao reconectar
```

---

## 8. Checklist de Implementacao

### 8.1 Estrutura Base
- [ ] `output: 'export'` em next.config.mjs
- [ ] `images: { unoptimized: true }`
- [ ] Viewport meta tags configuradas
- [ ] Safe area insets aplicados
- [ ] Fonte Plus Jakarta Sans carregada

### 8.2 Layout
- [ ] AppShell com Header + BottomNav (mobile) / Sidebar (desktop)
- [ ] Flexbox para layouts 1D, Grid para 2D
- [ ] Touch targets >= 44x44px
- [ ] Espacamento adequado (min 8px entre elementos tocaveis)

### 8.3 Navegacao
- [ ] BottomNav com max 5 itens
- [ ] Sidebar colapsavel no desktop
- [ ] Transicoes suaves entre paginas
- [ ] Back button funcional

### 8.4 Imagens
- [ ] next/image com lazy loading
- [ ] Formatos WebP quando possivel
- [ ] Placeholders/skeletons durante load
- [ ] Alt text em todas as imagens

### 8.5 Performance
- [ ] Code splitting com dynamic imports
- [ ] Debounce em inputs de busca
- [ ] Prefetch de rotas provaveis
- [ ] Bundle < 200kb (First Load JS)

### 8.6 PWA
- [ ] manifest.json configurado
- [ ] Service worker ativo
- [ ] Icons 192x192 e 512x512
- [ ] Splash screens (opcional)
- [ ] Indicador offline

### 8.7 Testes
- [ ] Testado em iPhone Safari
- [ ] Testado em Android Chrome
- [ ] Lighthouse score >= 90
- [ ] Funciona offline (cache)

---

## 9. Comandos Uteis

```bash
# Build para producao (gera pasta out/)
pnpm build

# Servir build estatico localmente
npx serve out

# Analisar bundle
ANALYZE=true pnpm build

# Gerar icons PWA
npx pwa-asset-generator logo.png public/icons

# Testar Lighthouse
npx lighthouse http://localhost:3000 --view
```

---

## 10. Referencias

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)
- [Material Design Touch Targets](https://m3.material.io/foundations/accessible-design/accessibility-basics)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
