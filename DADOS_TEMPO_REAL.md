# 📊 Implementação de Dados no Dashboard

## 📁 Estrutura Atual

### Dados Fixos (Fase Atual)
Os dados estão armazenados em `src/data/mock.jsx` e contêm leituras reais da mini estufa coletadas entre 11-14 de outubro de 2025.

**Formato dos dados:**
```javascript
{
  t: "00:00",           // Hora da leitura
  temp: 19.2,           // Temperatura em °C
  hum: 85.6,            // Umidade do ar em %
  light: 0,             // Luminosidade em %
  soil: 37,             // Umidade do solo em %
  bomba: false          // Status da bomba de irrigação
}
```

### Componentes Implementados

1. **StatCard** - Exibe KPIs dos sensores com variação percentual
2. **ChartPanel** - Gráfico de linha com histórico das leituras
3. **BombaStatus** - Status visual da bomba de irrigação
4. **SensorPicker** - Seletor para filtrar sensores específicos

---

## 🚀 Migração para Tempo Real

### Opção 1: API REST com Polling

**Estrutura recomendada:**

```javascript
// src/services/api.js
export async function fetchLatestReadings() {
  const response = await fetch('/api/sensores/latest');
  return response.json();
}

export async function fetchHistorico(inicio, fim) {
  const response = await fetch(`/api/sensores/historico?inicio=${inicio}&fim=${fim}`);
  return response.json();
}
```

**Hook customizado:**
```javascript
// src/hooks/useSensorData.js
import { useEffect, useState } from 'react';
import { fetchLatestReadings } from '../services/api';

export function useSensorData(intervaloMs = 5000) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      const novosDados = await fetchLatestReadings();
      setData(prev => [...prev, novosDados].slice(-50)); // Mantém últimos 50 pontos
      setLoading(false);
    };

    carregar();
    const intervalo = setInterval(carregar, intervaloMs);
    
    return () => clearInterval(intervalo);
  }, [intervaloMs]);

  return { data, loading };
}
```

**Atualizar Dashboard.jsx:**
```javascript
// Substituir:
const { data, reset } = useRotatingData(BASE_SERIES, 2500);

// Por:
const { data, loading } = useSensorData(5000); // atualiza a cada 5s
```

---

### Opção 2: WebSocket (Recomendado para tempo real)

**Estrutura recomendada:**

```javascript
// src/services/websocket.js
export class SensorWebSocket {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.listeners = new Set();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notifyListeners(data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      // Reconectar após 5 segundos
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(listener => listener(data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
```

**Hook para WebSocket:**
```javascript
// src/hooks/useWebSocketSensor.js
import { useEffect, useState } from 'react';
import { SensorWebSocket } from '../services/websocket';

let wsInstance = null;

export function useWebSocketSensor(wsUrl) {
  const [data, setData] = useState([]);
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    if (!wsInstance) {
      wsInstance = new SensorWebSocket(wsUrl);
      wsInstance.connect();
    }

    const unsubscribe = wsInstance.subscribe((novoDado) => {
      setData(prev => [...prev, novoDado].slice(-100)); // Mantém últimos 100 pontos
      setConectado(true);
    });

    return unsubscribe;
  }, [wsUrl]);

  return { data, conectado };
}
```

---

### Opção 3: MQTT via WebSocket

Para manter compatibilidade com o formato atual (MQTT):

```javascript
// src/services/mqtt.js
import mqtt from 'mqtt';

export class MQTTSensorClient {
  constructor(brokerUrl, topico) {
    this.brokerUrl = brokerUrl;
    this.topico = topico;
    this.client = null;
    this.listeners = new Set();
  }

  connect() {
    this.client = mqtt.connect(this.brokerUrl);

    this.client.on('connect', () => {
      console.log('Conectado ao broker MQTT');
      this.client.subscribe(this.topico);
    });

    this.client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        const formatado = this.formatarDado(data);
        this.notifyListeners(formatado);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    });
  }

  formatarDado(data) {
    const [datePart, timePart] = data.data_hora.split(' ');
    const [hora, minuto] = timePart.split(':');
    
    return {
      t: `${hora}:${minuto}`,
      temp: data.temperatura,
      hum: data.umidade_ar,
      light: data.luminosidade,
      soil: data.umidade_solo,
      bomba: data.status_bomba === "Bomba ativada",
      dataHoraCompleta: data.data_hora
    };
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(listener => listener(data));
  }

  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }
}
```

---

## 🗄️ Persistência de Histórico

### Backend Recomendado (Node.js + PostgreSQL)

```sql
-- Schema do banco de dados
CREATE TABLE leituras_sensores (
  id SERIAL PRIMARY KEY,
  data_hora TIMESTAMP NOT NULL,
  temperatura DECIMAL(5,2),
  umidade_ar DECIMAL(5,2),
  luminosidade INTEGER,
  umidade_solo INTEGER,
  umidade_solo_bruto INTEGER,
  status_bomba BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_data_hora ON leituras_sensores(data_hora DESC);
```

### API Endpoints

```javascript
// GET /api/sensores/latest - Última leitura
// GET /api/sensores/historico?inicio=2025-10-11&fim=2025-10-14 - Histórico
// GET /api/sensores/estatisticas?periodo=24h - Estatísticas agregadas
// POST /api/sensores/leitura - Inserir nova leitura (webhook do MQTT)
```

---

## 📋 Checklist de Migração

### Backend
- [ ] Configurar banco de dados (PostgreSQL/MySQL)
- [ ] Criar tabela de leituras
- [ ] Implementar API REST
- [ ] Configurar WebSocket ou MQTT bridge
- [ ] Criar job para limpeza de dados antigos

### Frontend
- [ ] Substituir `useRotatingData` por `useSensorData` ou `useWebSocketSensor`
- [ ] Remover `BASE_SERIES` de mock.jsx
- [ ] Adicionar indicador de conexão
- [ ] Implementar tratamento de erros
- [ ] Adicionar loader durante carregamento inicial
- [ ] Implementar filtro de período (data início/fim)
- [ ] Adicionar botão de exportar dados (CSV/Excel)

### Melhorias Futuras
- [ ] Alertas quando valores saem da faixa normal
- [ ] Gráfico de comparação de períodos
- [ ] Previsão de próxima ativação da bomba
- [ ] Dashboard mobile responsivo
- [ ] Notificações push
- [ ] Relatórios automáticos por e-mail

---

## 🔧 Configuração Rápida

### Variáveis de Ambiente
```env
# .env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_MQTT_BROKER=ws://broker.hivemq.com:8000/mqtt
VITE_MQTT_TOPIC=miniEstufaFelipe/leituras
```

### Exemplo de Uso com API
```javascript
// src/pages/Dashboard.jsx (versão API)
import { useSensorData } from '../hooks/useSensorData';

export default function Dashboard() {
  const { data, loading, erro } = useSensorData(5000);
  
  if (loading) return <div>Carregando sensores...</div>;
  if (erro) return <div>Erro ao carregar: {erro.message}</div>;
  
  // ... resto do código
}
```

---

## 📚 Recursos Adicionais

- [Recharts Documentation](https://recharts.org/)
- [MQTT.js](https://github.com/mqttjs/MQTT.js)
- [Socket.io](https://socket.io/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

