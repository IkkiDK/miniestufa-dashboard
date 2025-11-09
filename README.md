# 🌱 Dashboard Mini Estufa

Dashboard em tempo real para monitoramento de sensores de uma mini estufa, construído com React + Vite e WebSocket.

## 📊 Funcionalidades

- **Monitoramento em Tempo Real via WebSocket**
  - 🌡️ Temperatura
  - 💧 Umidade do Ar
  - ☀️ Luminosidade
  - 🌿 Umidade do Solo
  - 🚿 Status da Bomba de Irrigação
  
- **Visualizações Interativas**
  - Cards com KPIs e variação percentual
  - Gráficos de linha interativos (Recharts)
  - Indicadores visuais de status
  - Reconexão automática em caso de falha

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 🌐 Deploy em Produção

### 1. Configuração de Variáveis de Ambiente

**⚠️ IMPORTANTE:** Configure a variável de ambiente antes do deploy!

```bash
VITE_WS_URL=wss://miniestufa-backend.onrender.com/ws
```

**Backend já está rodando em:** `https://miniestufa-backend.onrender.com`

Para instruções detalhadas de configuração por plataforma, veja [ENV_SETUP.md](ENV_SETUP.md)

### 2. Deploy Automático

O projeto está configurado para build automático. Basta fazer push para o repositório conectado à plataforma de hospedagem.

```bash
git add .
git commit -m "Configure production environment"
git push origin main
```

### 3. Guia Completo de Deploy

Consulte [DEPLOY.md](DEPLOY.md) para:
- Instruções detalhadas de deploy
- URLs e endpoints
- Troubleshooting
- Checklist completo

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── BombaStatus.jsx  # Status da bomba de irrigação
│   ├── ChartPanel.jsx   # Gráfico de sensores
│   ├── Header.jsx       # Cabeçalho
│   ├── RealtimeSensorDisplay.jsx  # Display em tempo real
│   ├── SensorPicker.jsx # Seletor de sensores
│   ├── Sidebar.jsx      # Menu lateral
│   └── StatCard.jsx     # Card de KPI
├── hooks/
│   ├── useSupabaseHistory.js  # Hook para buscar histórico no Supabase
│   └── useWebSocket.js        # Hook para conexão WebSocket
├── services/
│   └── supabaseClient.js   # Cliente compartilhado do Supabase
├── pages/
│   └── Dashboard.jsx    # Página principal
├── utils/
│   └── dataParser.js    # Utilitários de parsing
├── config.js            # Configurações da aplicação
└── App.jsx              # Componente raiz
```

## ⚙️ Configuração

O arquivo `src/config.js` centraliza as configurações da aplicação:

```javascript
{
  wsUrl: 'ws://localhost:8080/ws',  // URL do WebSocket (configurável via VITE_WS_URL)
  reconnect: {
    enabled: true,
    interval: 5000  // Intervalo de reconexão em ms
  }
}
```

## 🔌 Integração com Backend

Este dashboard requer um servidor backend WebSocket. Consulte o repositório do backend para instruções de deploy:

**Endpoints esperados:**
- `ws://backend/ws` - WebSocket para dados em tempo real
- `http://backend/api/sensor/latest` - API REST para última leitura
- `http://backend/health` - Health check

**Formato de dados esperado:**
```json
{
  "data_hora": "03/11/2025 14:30:00",
  "temperatura": 22.5,
  "umidade_ar": 65.0,
  "luminosidade": 75,
  "umidade_solo": 45,
  "umidade_solo_bruto": 1850,
  "status_bomba": "Bomba ativada"
}
```

## 🚀 Deploy

### Render (Static Site + Env Group)

O repositório inclui um `render.yaml` com a configuração padrão. Para compartilhar as variáveis entre backend e frontend:

1. No painel da Render, crie um **Environment Group** chamado `mini-estufa-shared` contendo:
   - `SUPABASE_URL` → `https://itvftowtidgxrjgwpsjp.supabase.co`
   - `SUPABASE_ANON_KEY` → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
2. Associe esse grupo tanto ao backend (`miniestufa-backend`) quanto ao serviço estático do dashboard.
3. O `render.yaml` já aponta o static site para esse grupo (`fromGroup: mini-estufa-shared`), além de definir `VITE_SUPABASE_HISTORY_TABLE`.
4. Após alterar qualquer valor, execute “Clear build cache & deploy” no serviço estático para que o Vite reconstrua o bundle com as novas variáveis.

### Outras plataformas

Em qualquer serviço de hospedagem, configure as mesmas variáveis (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_HISTORY_TABLE`) antes de rodar `npm run build`. Lembre-se de que o Vite lê essas variáveis no momento da compilação; após qualquer alteração, execute um novo build/deploy.

## 🎨 Tecnologias

- **React 18** - Biblioteca de UI
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Recharts** - Biblioteca de gráficos
- **Lucide React** - Ícones modernos
- **WebSocket API** - Comunicação em tempo real

## 🐛 Troubleshooting

### Erro de Conexão WebSocket

Se aparecer "Erro de Conexão":

1. Verifique se o backend está rodando
2. Confirme a URL do WebSocket na variável `VITE_WS_URL`
3. Verifique se o backend tem CORS habilitado
4. Em produção, use `wss://` (seguro) ao invés de `ws://`

### Build Falha

```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 Licença

Este projeto foi desenvolvido como parte de um Trabalho de Conclusão de Curso (TCC).

## 👥 Autores

Desenvolvido para monitoramento de mini estufa inteligente.
