# CaronAqui - Guia de Testes PWA

## Como Testar a PWA Localmente

### 1. Build e Start do Projeto

```bash
# Instalar dependências
pnpm install

# Build para produção (gera PWA)
pnpm run build

# Rodar em modo produção
pnpm start
```

A PWA estará disponível em `http://localhost:3000`

### 2. Testar no Desktop (Chrome DevTools)

1. Abrir DevTools (F12)
2. Ir para **Application** tab
3. Verificar:
   - **Manifest**: Deve mostrar manifest.json com nome "CaronAqui"
   - **Service Workers**: Deve mostrar "Service Worker" como "activated and running"
   - **Cache Storage**: Deve mostrar caches com assets estáticos
4. Clicar em **Install** prompt que aparece na URL bar (ou usar botão "InstallPrompt")

### 3. Testar Menu Mobile Inferior

- O `BottomNav` aparece automaticamente em telas < 768px (breakpoint `md:`)
- 5 botões: Home, Buscar, Publicar (destaque), Reservas, Perfil
- Cada botão tem touch target mínimo de 44px
- Botão "Publicar" flutua acima da barra com círculo destacado

**Verificar:**
- Menu não sobrepõe conteúdo (padding-bottom: pb-24 aplicado)
- Safe area inset aplicado no bottom (notch/home indicator)
- Ícones e textos são claros

### 4. Testar No Mobile (iOS ou Android)

#### iOS:
1. Abrir no Safari
2. Tocar em **Share** → **Add to Home Screen**
3. Nomear como "CaronAqui"
4. Instalar

**Verificar:**
- App abre em tela cheia (sem barra de URL)
- Home indicator não sobrepõe conteúdo
- Safe area respected
- OfflineIndicator aparece se desligar WiFi

#### Android:
1. Abrir no Chrome
2. Tocar no menu (3 pontos)
3. Selecionar **"Instalar aplicativo"**
4. Confirmar

**Verificar:**
- App abre em tela cheia
- Status bar visível no topo
- Navigation bar não sobrepõe BottomNav
- InstallPrompt aparece após 5 segundos

### 5. Testar Modo Offline

1. DevTools → Network tab
2. Selecionar "Offline"
3. Navegar pela app

**Verificar:**
- `OfflineIndicator` (barra vermelha) aparece no topo
- Páginas já carregadas continuam funcionando (cache)
- API requests falham gracefully
- Tentar ação que precisa rede mostra mensagem de erro

### 6. Testar Performance (Lighthouse)

DevTools → Lighthouse:
```bash
# ou via CLI:
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

**Métricas esperadas:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- PWA score > 90

### 7. Instalar Prompt Customizado

O app mostra `InstallPrompt` após 5 segundos de uso em:
- Desktop Chrome/Edge (deferrable prompt)
- Android (native prompt)
- iOS via Safari (não tem prompt nativo, mas oferece "Add to Home Screen")

**Testar:**
- Fechar e reabrir para ver novamente
- Botões "Instalar" e "Descartar" funcionam
- Após instalar, app abre sem barra de navegação

### 8. Diretório de Caches

Para verificar o que foi cacheado:

```javascript
// No console do navegador:
caches.keys().then(cacheNames => {
  cacheNames.forEach(cacheName => {
    caches.open(cacheName).then(cache => {
      cache.keys().then(requests => {
        console.log(cacheName, requests.map(r => r.url));
      });
    });
  });
});
```

### 9. Verificar Safe Area

Em dispositivos com notch/home indicator:
- Conteúdo não deve ser cortado
- Use classes: `.safe-area-inset-top`, `.safe-area-inset-bottom`
- BottomNav já tem `.safe-area-inset-bottom` aplicado

### 10. Testar em Diferentes Tamanhos

- **Mobile**: 375px (iPhone SE)
- **Mobile**: 390px (iPhone 13)
- **Mobile**: 412px (Android comum)
- **Tablet**: 768px (iPad mini)
- **Desktop**: 1024px+

Usar DevTools device emulation (Ctrl+Shift+M no Chrome)

## Troubleshooting

### BottomNav não aparece
- Verificar se breakpoint `md:hidden` está correto
- Verificar em mobile (< 768px)
- DevTools → Responsive Mode

### Service Worker não ativa
- Abrir em HTTPS ou localhost
- Limpar cache: DevTools → Application → Clear storage → Clear all
- Recarregar página

### Manifest não carrega
- Verificar `/public/manifest.json` existe
- Verificar `<link rel="manifest" href="/manifest.json">` em layout.tsx
- Verificar MIME type é `application/manifest+json`

### InstallPrompt não aparece
- Deve estar em PWA completa (HTTPS + Service Worker ativo)
- Android: aguardar 5 segundos
- iOS: não tem prompt (usar Share → Add to Home Screen)
- Chrome: verificar se já instalado em outro perfil

## Deploy para Hostinger

Após `pnpm run build`:
1. Upload pasta `out/` para `/public_html/`
2. Certificar `.htaccess` está configurado (rewrite rules)
3. HTTPS deve estar ativo (PWA requer segurança)
4. Service Worker será registrado automaticamente

Verificar em: `https://seu-dominio.com.br`

