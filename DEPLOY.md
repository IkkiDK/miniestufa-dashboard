# 🚀 Guia de Deploy

## Backend (Render)

### URL do Backend
```
https://miniestufa-backend.onrender.com
```

### Endpoints Disponíveis
- WebSocket: `wss://miniestufa-backend.onrender.com/ws`
- API REST: `https://miniestufa-backend.onrender.com/api/sensor/latest`
- Push de Dados: `https://miniestufa-backend.onrender.com/api/sensor/push`
- Health Check: `https://miniestufa-backend.onrender.com/health`

### Configuração no Render
O backend já está configurado corretamente:
- ✅ Porta dinâmica via `PORT` env var
- ✅ CORS habilitado para todas origens
- ✅ WebSocket Upgrader configurado

---

## Frontend (Vercel/Netlify/Render)

### 1. Configure a Variável de Ambiente

No painel da plataforma de hospedagem, adicione:

```bash
VITE_WS_URL=wss://miniestufa-backend.onrender.com/ws
```

**⚠️ IMPORTANTE:** Use `wss://` (seguro) e não `ws://` (não seguro)

### 2. Plataformas de Deploy

#### Vercel
```bash
# Via CLI
vercel env add VITE_WS_URL

# Ou no painel:
Settings > Environment Variables
```

#### Netlify
```bash
# Via CLI
netlify env:set VITE_WS_URL "wss://miniestufa-backend.onrender.com/ws"

# Ou no painel:
Site settings > Environment variables
```

#### Render
```bash
# No painel:
Environment > Add Environment Variable
VITE_WS_URL = wss://miniestufa-backend.onrender.com/ws
```

### 3. Deploy

Após configurar a variável de ambiente:

```bash
# Commit e push para o repositório
git add .
git commit -m "Configure production WebSocket URL"
git push origin main
```

O deploy será automático após o push.

---

## Testando a Conexão

### Backend Health Check
```bash
curl https://miniestufa-backend.onrender.com/health
```

Resposta esperada:
```json
{"status":"ok"}
```

### Última Leitura
```bash
curl https://miniestufa-backend.onrender.com/api/sensor/latest
```

### Testando WebSocket (via Browser Console)
```javascript
const ws = new WebSocket('wss://miniestufa-backend.onrender.com/ws');
ws.onopen = () => console.log('✅ Conectado!');
ws.onmessage = (e) => console.log('📨 Dados:', JSON.parse(e.data));
ws.onerror = (e) => console.error('❌ Erro:', e);
```

---

## Troubleshooting

### ❌ Erro: "Websocket protocol error"
**Causa:** URL usando `ws://` ao invés de `wss://`

**Solução:** Altere para `wss://miniestufa-backend.onrender.com/ws`

### ❌ Erro: "Connection refused"
**Causa:** Backend não está rodando

**Solução:** Verifique o status no Render e restart se necessário

### ❌ Erro: "CORS policy"
**Causa:** CORS não configurado

**Solução:** O backend já tem CORS habilitado, verifique se está usando a URL correta

### ⚠️ Backend "dormindo" no Render (plano free)
**Causa:** Render coloca serviços inativos para "dormir" após 15 min de inatividade

**Solução:**
- Primeira conexão pode demorar 30-60s (cold start)
- Configure um ping externo (ex: cron-job.org) para manter ativo
- Ou faça upgrade para plano pago

---

## Variáveis de Ambiente

### Frontend
| Variável | Desenvolvimento | Produção |
|----------|----------------|----------|
| `VITE_WS_URL` | `ws://localhost:8080/ws` | `wss://miniestufa-backend.onrender.com/ws` |

### Backend
| Variável | Valor |
|----------|-------|
| `PORT` | Automaticamente definida pelo Render (10000) |

---

## Checklist de Deploy

### Backend ✅
- [x] Deploy no Render
- [x] Health check funcionando
- [x] WebSocket configurado
- [x] CORS habilitado

### Frontend
- [ ] Variável `VITE_WS_URL` configurada
- [ ] Build de produção testado localmente (`npm run build && npm run preview`)
- [ ] Deploy na plataforma escolhida
- [ ] Conexão WebSocket testada
- [ ] Dashboard exibindo dados em tempo real

---

## URLs de Produção

Após deploy completo, atualize aqui:

- **Backend:** https://miniestufa-backend.onrender.com
- **Frontend:** [SUA_URL_AQUI]
- **WebSocket:** wss://miniestufa-backend.onrender.com/ws

