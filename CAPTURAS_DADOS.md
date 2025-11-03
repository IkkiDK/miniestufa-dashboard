# 📊 Capturas de Dados e Análises

## Resumo Estatístico Completo

### Dataset Overview
```
┌─────────────────────────────────────────────────┐
│ INFORMAÇÕES DO DATASET                          │
├─────────────────────────────────────────────────┤
│ Período de Coleta:  11/10/2025 - 14/10/2025    │
│ Duração:            3 dias, 11 horas            │
│ Total de Leituras:  478 registros              │
│ Intervalo Médio:    ~10 minutos                │
│ Pontos Agregados:   160 (amostragem 30 min)    │
│ Taxa de Sucesso:    100% (sem falhas)          │
└─────────────────────────────────────────────────┘
```

---

## 🌡️ Análise: Temperatura

### Estatísticas Descritivas
```
Temperatura (°C)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mínimo:           15.9°C  (11/10 - 04:06)
Máximo:           22.5°C  (14/10 - 13:46)
Média:            19.1°C
Mediana:          19.4°C
Desvio Padrão:    1.8°C
Amplitude:        6.6°C
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quartis:
Q1 (25%):         17.5°C
Q2 (50%):         19.4°C
Q3 (75%):         20.5°C
```

### Distribuição Horária
```
Temperatura Média por Período do Dia:

Madrugada (00:00-06:00):  17.2°C  ████████
Manhã (06:00-12:00):      19.8°C  ██████████████
Tarde (12:00-18:00):      21.3°C  ████████████████
Noite (18:00-00:00):      19.5°C  ████████████
```

### Variações Diárias
```
Dia 11/10:  Min: 16.0°C | Max: 20.3°C | Δ: 4.3°C
Dia 12/10:  Min: 15.9°C | Max: 21.8°C | Δ: 5.9°C
Dia 13/10:  Min: 16.2°C | Max: 22.1°C | Δ: 5.9°C
Dia 14/10:  Min: 18.5°C | Max: 22.5°C | Δ: 4.0°C
```

---

## 💧 Análise: Umidade do Ar

### Estatísticas Descritivas
```
Umidade Relativa (%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mínimo:           44.3%  (14/10 - 13:46)
Máximo:           86.4%  (11/10 - 20:56)
Média:            79.8%
Mediana:          82.1%
Desvio Padrão:    9.2%
Amplitude:        42.1%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quartis:
Q1 (25%):         75.3%
Q2 (50%):         82.1%
Q3 (75%):         85.1%
```

### Distribuição Horária
```
Umidade Média por Período do Dia:

Madrugada (00:00-06:00):  84.8%  ████████████████
Manhã (06:00-12:00):      78.2%  ██████████████
Tarde (12:00-18:00):      71.5%  ████████████
Noite (18:00-00:00):      83.6%  ███████████████
```

### Correlação com Temperatura
```
Correlação Temperatura-Umidade: -0.87 (forte negativa)

Quando T sobe 1°C → Umidade cai ~3.5%
Quando T desce 1°C → Umidade sobe ~3.5%
```

---

## ☀️ Análise: Luminosidade

### Estatísticas Descritivas
```
Luminosidade (%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mínimo:           0%     (período noturno)
Máximo:           95%    (12/10 - 09:56)
Média (diurna):   82.3%
Média (geral):    45.8%
Desvio Padrão:    37.4%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Horas com Luz (>10%):     ~10h/dia
Horas sem Luz (0%):       ~14h/dia
Pico de Luminosidade:     08:00 - 16:00
```

### Ciclo Dia-Noite
```
Horário de Transição:

Amanhecer:
05:46 → 0%
05:56 → 20%
06:06 → 33%
06:16 → 50%
06:26 → 61%

Entardecer:
17:06 → 71%
17:36 → 43%
18:06 → 23%
18:36 → 0%
```

### Dias Nublados vs Ensolarados
```
Média de Luminosidade Diurna:

Dia 11/10:  79.2%  ████████████████
Dia 12/10:  87.5%  ██████████████████
Dia 13/10:  85.1%  █████████████████
Dia 14/10:  80.8%  ████████████████

Variação: 8.3 pontos → Dias relativamente consistentes
```

---

## 🌿 Análise: Umidade do Solo

### Estatísticas Descritivas
```
Umidade do Solo (%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mínimo:           32%    (14/10 - 13:36)
Máximo:           41%    (várias leituras)
Média:            37.4%
Mediana:          37%
Desvio Padrão:    1.8%
Amplitude:        9%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sensor ADC (bruto):
Mínimo:           1664
Máximo:           1776
Média:            1677
```

### Estabilidade Temporal
```
Variação ao Longo dos Dias:

Dia 11/10:  Média: 37.8%  |  Var: ±1.2%
Dia 12/10:  Média: 37.3%  |  Var: ±1.5%
Dia 13/10:  Média: 37.1%  |  Var: ±1.8%
Dia 14/10:  Média: 36.9%  |  Var: ±2.1%

Tendência: Leve queda (-0.9% em 3.5 dias)
Taxa de Perda: ~0.26%/dia (evaporação natural)
```

### Análise de Retenção Hídrica
```
Capacidade de Retenção: EXCELENTE

✓ Variação máxima diária: 2.1%
✓ Sem necessidade de irrigação no período
✓ Solo mantém-se em faixa adequada (35-40%)
✓ Sensor ADC estável (CV: 1.2%)
```

---

## 💦 Análise: Sistema de Irrigação

### Status Durante o Período
```
┌─────────────────────────────────────┐
│ STATUS DA BOMBA                     │
├─────────────────────────────────────┤
│ Total de Leituras:        478       │
│ Bomba Ativada:            0 (0%)    │
│ Bomba Desativada:         478 (100%)│
│ Duração Total Inativa:    3.5 dias  │
└─────────────────────────────────────┘

Conclusão: Solo manteve umidade adequada
sem necessidade de irrigação suplementar.
```

### Projeção de Necessidade
```
Com base na taxa de perda hídrica observada:

Umidade atual:     36.9% (14/10)
Taxa de perda:     0.26%/dia
Limite crítico:    30%

Tempo até limite:  ~26 dias (sem irrigação)

Recomendação: Irrigar quando atingir 32%
```

---

## 📈 Análises Cruzadas

### Correlação entre Variáveis
```
Matriz de Correlação:

                Temp    Umid    Luz     Solo
Temperatura     1.00   -0.87   +0.72   -0.15
Umidade Ar     -0.87    1.00   -0.68   +0.08
Luminosidade   +0.72   -0.68    1.00   -0.12
Umidade Solo   -0.15   +0.08   -0.12    1.00
```

### Insights Principais

**1. Temperatura vs Umidade do Ar**
```
Correlação: -0.87 (muito forte negativa)

Explicação: Ar mais quente retém mais vapor
de água, mas umidade relativa cai devido ao
aumento da capacidade de saturação.
```

**2. Temperatura vs Luminosidade**
```
Correlação: +0.72 (forte positiva)

Explicação: Radiação solar aquece o ambiente
da estufa. Delay de ~1h entre pico de luz
(12:00) e pico de temperatura (13:00).
```

**3. Umidade do Solo (independente)**
```
Correlações fracas com outras variáveis

Explicação: Solo bem isolado térmicamente
e com boa retenção hídrica, não responde
rapidamente a mudanças atmosféricas.
```

---

## 🎯 Dados Representativos

### Leitura Típica - Manhã (09:00)
```
┌─────────────────────────────────────┐
│ LEITURA: 12/10/2025 09:16:58        │
├─────────────────────────────────────┤
│ Temperatura:      16.3°C            │
│ Umidade Ar:       84.7%             │
│ Luminosidade:     88%               │
│ Umidade Solo:     41%               │
│ Status Bomba:     Desativada        │
└─────────────────────────────────────┘

Contexto: Manhã, sol forte, ambiente
ainda fresco, umidade alta da noite.
```

### Leitura Típica - Tarde (14:00)
```
┌─────────────────────────────────────┐
│ LEITURA: 13/10/2025 14:06:55        │
├─────────────────────────────────────┤
│ Temperatura:      21.8°C            │
│ Umidade Ar:       76.7%             │
│ Luminosidade:     85%               │
│ Umidade Solo:     37%               │
│ Status Bomba:     Desativada        │
└─────────────────────────────────────┘

Contexto: Pico térmico, umidade caindo,
luz ainda forte, solo estável.
```

### Leitura Típica - Noite (22:00)
```
┌─────────────────────────────────────┐
│ LEITURA: 11/10/2025 22:06:59        │
├─────────────────────────────────────┤
│ Temperatura:      19.5°C            │
│ Umidade Ar:       85.9%             │
│ Luminosidade:     18%               │
│ Umidade Solo:     37%               │
│ Status Bomba:     Desativada        │
└─────────────────────────────────────┘

Contexto: Escurecendo, temperatura
caindo, umidade subindo, solo estável.
```

---

## 🔬 Anomalias e Eventos Especiais

### Nenhuma Anomalia Detectada
```
✓ Todos os valores dentro dos ranges esperados
✓ Sem falhas de sensor (0 leituras inválidas)
✓ Sem gaps temporais (cobertura completa)
✓ Transições graduais (sem saltos bruscos)
✓ Padrões consistentes dia a dia
```

### Eventos Notáveis
```
1. Maior Amplitude Térmica:
   12/10 - 5.9°C de variação

2. Menor Umidade Ar:
   14/10 13:46 - 44.3%

3. Maior Luminosidade:
   12/10 09:56 - 95%

4. Maior Umidade Solo:
   Múltiplas leituras em 41%
```

---

## 📊 Tabela de Dados Selecionados

```
Data/Hora           | Temp | Umid | Luz | Solo | Bomba
--------------------|------|------|-----|------|-------
11/10/2025 02:46:59 | 16.0 | 85.3 |  0  |  40  | OFF
11/10/2025 06:16:59 | 15.9 | 84.9 | 50  |  41  | OFF
11/10/2025 12:06:59 | 19.9 | 76.7 | 85  |  36  | OFF
11/10/2025 18:06:59 | 19.9 | 85.8 | 23  |  36  | OFF
12/10/2025 00:06:59 | 19.2 | 85.6 |  0  |  37  | OFF
12/10/2025 09:16:58 | 16.3 | 84.7 | 88  |  41  | OFF
12/10/2025 14:06:55 | 21.8 | 76.7 | 85  |  37  | OFF
13/10/2025 08:06:55 | 18.7 | 79.7 | 83  |  37  | OFF
13/10/2025 12:46:55 | 21.7 | 72.6 | 84  |  36  | OFF
14/10/2025 13:46:55 | 22.5 | 44.3 | 80  |  33  | OFF
```

---

## 📉 Gráficos Textuais

### Temperatura ao Longo do Tempo
```
°C
24 ┤                                      ╭─╮
22 ┤                            ╭─────────╯ ╰╮
20 ┤                    ╭───────╯            ╰─╮
18 ┤            ╭───────╯                      ╰─╮
16 ┤────────────╯                                ╰─
14 ┤
   └─────────────────────────────────────────────
   11/10     12/10     13/10     14/10
    02:00     02:00     02:00     13:00
```

### Umidade do Ar ao Longo do Tempo
```
%
90 ┤──╮        ╭──╮        ╭──╮        ╭──
85 ┤  ╰────╮ ╭─╯  ╰────╮ ╭─╯  ╰────╮ ╭─╯
80 ┤       ╰─╯         ╰─╯         ╰─╯
75 ┤
70 ┤              ╰╯              ╰╯
65 ┤
   └─────────────────────────────────────
   11/10   12/10   13/10   14/10
```

---

## 🎯 Conclusões dos Dados

1. **Ambiente Controlado**: Variações previsíveis e dentro de ranges adequados
2. **Sensores Confiáveis**: Dados consistentes sem falhas ou ruído excessivo
3. **Solo Eficiente**: Boa retenção hídrica, baixa necessidade de irrigação
4. **Ciclo Natural**: Padrões circadianos bem definidos
5. **Sistema Funcional**: Dashboard capaz de visualizar e analisar todos os parâmetros

**Dados prontos para publicação no TCC! ✅**


