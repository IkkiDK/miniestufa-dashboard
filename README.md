# 🌱 Dashboard Mini Estufa

Dashboard moderno para monitoramento de sensores de uma mini estufa, construído com React + Vite.

## 📊 Funcionalidades

- **Monitoramento de Sensores em Tempo Real**
  - 🌡️ Temperatura
  - 💧 Umidade do Ar
  - ☀️ Luminosidade
  - 🌿 Umidade do Solo
  
- **Visualizações**
  - Cards com KPIs e variação percentual
  - Gráficos interativos de linha (Recharts)
  - Status da bomba de irrigação
  - Filtros por sensor específico

- **Dados**
  - Atualmente usando dados históricos reais (11-14 out/2025)
  - Simulação de rotação de dados para demonstração
  - Preparado para migração para tempo real (ver `DADOS_TEMPO_REAL.md`)

## 🚀 Como Executar

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

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── BombaStatus.jsx  # Status da bomba de irrigação
│   ├── ChartPanel.jsx   # Gráfico de linha dos sensores
│   ├── Header.jsx       # Cabeçalho do dashboard
│   ├── SensorPicker.jsx # Seletor de sensores
│   ├── Sidebar.jsx      # Menu lateral
│   └── StatCard.jsx     # Card de KPI
├── data/
│   └── mock.jsx         # Dados históricos da mini estufa
├── hooks/
│   └── useRotatingData.js  # Hook para simular rotação de dados
├── pages/
│   └── Dashboard.jsx    # Página principal
├── utils/
│   └── dataParser.js    # Parser para processar dados
└── App.jsx              # Componente raiz
```

## 🔄 Migração para Tempo Real

Este projeto está preparado para receber dados em tempo real. Consulte o arquivo `DADOS_TEMPO_REAL.md` para:

- Estrutura de API REST
- Implementação com WebSocket
- Integração com MQTT
- Schema do banco de dados
- Checklist completo de migração

## 🎨 Tecnologias

- **React 18** - Biblioteca de UI
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos
- **Lucide React** - Ícones

## 📝 Origem dos Dados

Os dados utilizados são leituras reais de uma mini estufa, contendo:
- Temperatura ambiente
- Umidade relativa do ar
- Luminosidade
- Umidade do solo (percentual e valor bruto)
- Status da bomba de irrigação

Formato original: logs MQTT do tópico `miniEstufaFelipe/leituras`

## 🛠️ Próximos Passos

- [ ] Implementar API backend
- [ ] Conectar com WebSocket/MQTT
- [ ] Adicionar sistema de alertas
- [ ] Exportação de dados (CSV/Excel)
- [ ] Filtros de período personalizados
- [ ] Modo dark theme
- [ ] PWA para acesso mobile
