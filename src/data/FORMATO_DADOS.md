# 📄 Formato dos Dados

## Fonte Original

Os dados foram extraídos do arquivo `public/miniEstufa 11-14.txt`, que contém leituras MQTT de sensores.

### Formato Original (MQTT)
```
miniEstufaFelipe/leituras {"data_hora": "11/10/2025 02:46:59", "temperatura": 16.0, "umidade_ar": 85.3, "luminosidade": 0, "umidade_solo": 40, "umidade_solo_bruto": 1681, "status_bomba": "Bomba desativada"}
```

### Campos Disponíveis
| Campo | Tipo | Descrição | Unidade |
|-------|------|-----------|---------|
| `data_hora` | String | Data e hora da leitura | "DD/MM/YYYY HH:MM:SS" |
| `temperatura` | Number | Temperatura ambiente | °C |
| `umidade_ar` | Number | Umidade relativa do ar | % |
| `luminosidade` | Number | Nível de luminosidade | % (0-100) |
| `umidade_solo` | Number | Umidade do solo (calibrado) | % |
| `umidade_solo_bruto` | Number | Valor bruto do sensor de solo | ADC (analog) |
| `status_bomba` | String | Estado da bomba | "Bomba ativada" / "Bomba desativada" |

---

## Formato Processado (Dashboard)

Os dados foram agregados por hora e convertidos para o formato usado no dashboard:

```javascript
{
  t: "00:00",           // Hora da leitura (HH:MM)
  temp: 19.2,           // Temperatura em °C
  hum: 85.6,            // Umidade do ar em %
  light: 0,             // Luminosidade em %
  soil: 37,             // Umidade do solo em %
  bomba: false          // Status da bomba (boolean)
}
```

### Processo de Agregação

1. **Coleta**: Leituras a cada ~10 minutos
2. **Agrupamento**: Por hora (00:00, 01:00, 02:00...)
3. **Agregação**: Média dos valores numéricos
4. **Bomba**: `true` se foi ativada em algum momento da hora
5. **Amostragem**: Selecionadas leituras a cada 2 horas para otimizar visualização

### Script de Processamento

O processamento foi feito com Node.js:

```javascript
const fs = require('fs');

// Lê arquivo
const content = fs.readFileSync('public/miniEstufa 11-14.txt', 'utf-8');
const lines = content.trim().split('\n');

// Parse de cada linha
const parsed = lines.map(line => {
  const parts = line.split(' ');
  const jsonStr = parts.slice(1).join(' ');
  const data = JSON.parse(jsonStr);
  
  const [datePart, timePart] = data.data_hora.split(' ');
  const [hora, minuto] = timePart.split(':');
  
  return {
    t: `${hora}:${minuto}`,
    temp: data.temperatura,
    hum: data.umidade_ar,
    light: data.luminosidade,
    soil: data.umidade_solo,
    bomba: data.status_bomba === 'Bomba ativada'
  };
});

// Agrupa por hora
const byHour = {};
parsed.forEach(item => {
  const hour = item.t.split(':')[0];
  if (!byHour[hour]) byHour[hour] = [];
  byHour[hour].push(item);
});

// Calcula médias
const aggregated = Object.keys(byHour).map(hour => {
  const items = byHour[hour];
  const avg = (key) => items.reduce((s, i) => s + i[key], 0) / items.length;
  
  return {
    t: `${hour}:00`,
    temp: Number(avg('temp').toFixed(1)),
    hum: Number(avg('hum').toFixed(1)),
    light: Math.round(avg('light')),
    soil: Math.round(avg('soil')),
    bomba: items.some(i => i.bomba)
  };
});
```

---

## Estatísticas dos Dados

### Período
- **Início**: 11/10/2025 02:46:59
- **Fim**: 14/10/2025 13:46:55
- **Duração**: ~3.5 dias
- **Total de leituras**: 488 registros
- **Intervalo**: ~10 minutos

### Ranges dos Sensores

| Sensor | Mínimo | Máximo | Média |
|--------|--------|--------|-------|
| Temperatura | 15.9°C | 22.5°C | ~19°C |
| Umidade Ar | 44.3% | 86.4% | ~80% |
| Luminosidade | 0% | 95% | ~45% |
| Umidade Solo | 32% | 41% | ~37% |

### Observações

- 🌙 **Período Noturno (00:00-05:00)**: Luminosidade = 0%, alta umidade do ar
- ☀️ **Período Diurno (06:00-18:00)**: Luminosidade 60-90%, temperatura mais alta
- 💧 **Bomba**: Não foi ativada durante o período de coleta
- 🌡️ **Temperatura**: Variação diária de ~5°C
- 💨 **Umidade do Solo**: Relativamente estável (~37%)

---

## Uso no Código

### Importar Dados
```javascript
import { BASE_SERIES, COLORS, SENSOR_META } from '../data/mock';
```

### Acessar Leitura Específica
```javascript
const leituraAtual = BASE_SERIES[BASE_SERIES.length - 1];
console.log(`Temperatura: ${leituraAtual.temp}°C`);
console.log(`Bomba: ${leituraAtual.bomba ? 'Ativada' : 'Desativada'}`);
```

### Filtrar por Horário
```javascript
const leiturasDiurnas = BASE_SERIES.filter(item => {
  const hora = parseInt(item.t.split(':')[0]);
  return hora >= 6 && hora <= 18;
});
```

### Calcular Estatísticas
```javascript
const temperaturaMedia = BASE_SERIES.reduce((sum, item) => 
  sum + item.temp, 0) / BASE_SERIES.length;

const tempMax = Math.max(...BASE_SERIES.map(item => item.temp));
const tempMin = Math.min(...BASE_SERIES.map(item => item.temp));
```

---

## Migração para API

Quando conectar a uma API real, o formato de resposta deve ser compatível:

### Endpoint: GET /api/sensores/leituras
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-10-27T14:30:00Z",
      "temperatura": 22.3,
      "umidadeAr": 65.5,
      "luminosidade": 85,
      "umidadeSolo": 38,
      "bombaAtiva": false
    }
  ],
  "total": 12,
  "periodo": {
    "inicio": "2025-10-27T00:00:00Z",
    "fim": "2025-10-27T23:59:59Z"
  }
}
```

### Adaptador
```javascript
function adaptarDadosAPI(apiResponse) {
  return apiResponse.data.map(item => ({
    t: new Date(item.timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    temp: item.temperatura,
    hum: item.umidadeAr,
    light: item.luminosidade,
    soil: item.umidadeSolo,
    bomba: item.bombaAtiva
  }));
}
```

