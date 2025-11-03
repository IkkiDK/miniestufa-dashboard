# ⚙️ Configuração de Variáveis de Ambiente

## 📝 Criar arquivo .env

Crie um arquivo `.env` na raiz do projeto `dashboard-vite/`:

### Para Desenvolvimento Local:

```env
VITE_WS_URL=ws://localhost:8080/ws
```

### Para Produção (após criar o arquivo .env):

```env
VITE_WS_URL=wss://miniestufa-backend.onrender.com/ws
```

## 🚀 Deploy em Plataformas

### Vercel

1. Acesse o painel do projeto
2. Vá em **Settings** > **Environment Variables**
3. Adicione:
   - **Name:** `VITE_WS_URL`
   - **Value:** `wss://miniestufa-backend.onrender.com/ws`
   - **Environment:** Production

Ou via CLI:
```bash
vercel env add VITE_WS_URL production
# Digite: wss://miniestufa-backend.onrender.com/ws
```

### Netlify

1. Acesse **Site settings** > **Environment variables**
2. Clique em **Add a variable**
3. Adicione:
   - **Key:** `VITE_WS_URL`
   - **Value:** `wss://miniestufa-backend.onrender.com/ws`

Ou via CLI:
```bash
netlify env:set VITE_WS_URL "wss://miniestufa-backend.onrender.com/ws"
```

### Render

1. Acesse o dashboard do serviço
2. Vá em **Environment**
3. Clique em **Add Environment Variable**
4. Adicione:
   - **Key:** `VITE_WS_URL`
   - **Value:** `wss://miniestufa-backend.onrender.com/ws`

## ⚠️ IMPORTANTE

- **Desenvolvimento:** Use `ws://` (não seguro)
- **Produção:** Use `wss://` (seguro com SSL/TLS)
- Nunca commite o arquivo `.env` (ele já está no `.gitignore`)
- Use `.env.example` como referência

## ✅ Verificar Configuração

Após configurar, teste localmente:

```bash
# Build local com variável de produção
VITE_WS_URL=wss://miniestufa-backend.onrender.com/ws npm run build
npm run preview
```

Abra o navegador e verifique no console se conectou ao backend correto.

## 📋 Checklist

- [ ] Criar arquivo `.env` na raiz do projeto
- [ ] Adicionar `VITE_WS_URL` com a URL correta
- [ ] Testar build local
- [ ] Configurar variável no serviço de hospedagem
- [ ] Fazer deploy
- [ ] Verificar conexão WebSocket funcionando

