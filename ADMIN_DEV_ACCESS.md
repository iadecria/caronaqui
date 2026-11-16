# Acesso Desenvolvedor - Painel Admin CaronAqui

## Como Acessar

Existem 3 formas de acessar o painel admin em modo desenvolvedor:

### 1. Via Página de Login Dev (Recomendado)
```
/admin/dev-login
```
Clique em "Acessar Painel Admin" para entrar automaticamente com o usuário mock.

### 2. Via Query Parameter
```
/admin?dev=true
```
Adicione `?dev=true` a qualquer URL do painel admin para fazer login automático.

### 3. Via Função devLogin() no Console
```javascript
// No console do navegador:
localStorage.setItem('caronaqui_dev', 'true')
```

## Funcionalidades do Admin

- **Dashboard**: Métricas em tempo real (usuários ativos, viagens, CO2, denúncias)
- **Moderação de Usuários**: Aprovar/rejeitar usuários, suspender contas
- **Viagens**: Monitorar todas as viagens ativas
- **Denúncias**: Revisar e investigar denúncias de usuários
- **Configurações**: Ajustar preços, margens, regras de cancelamento

## Dados Mock

O sistema usa dados mockados em modo dev:

```javascript
{
  id: 'u1',
  name: 'Joao Pedro',
  email: 'joao@email.com',
  verifiedPhone: true,
  verifiedId: true,
  memberSince: '2024-01-15'
}
```

Todos os usuários e dados visualizados são simulados e não afetam o banco de dados real.

## Fluxo de Autenticação

1. Usuário acessa `/admin`
2. AdminProtectedLayout verifica se está autenticado
3. Se não está:
   - Redireciona para `/admin/dev-login` (primeira visita)
   - Ou aceita `?dev=true` para login automático
4. `devLogin()` é chamado do auth-context
5. Acesso ao painel é liberado

## Variáveis de Ambiente

Para produção, adicione:

```env
ADMIN_DEV_PASSWORD=sua_senha_secreta
ADMIN_DEV_EMAIL=admin@caronaqui.dev
```

(Implementação em progresso)

## Logout

Clique no botão "Logout" no header do admin para desconectar.
