/**
 * Parser para processar dados históricos da mini estufa
 * 
 * Futuramente, este arquivo poderá ser adaptado para:
 * - Consumir dados de uma API em tempo real
 * - Gerenciar cache e histórico de leituras
 * - Implementar WebSocket para atualizações ao vivo
 */

/**
 * Processa uma linha do arquivo de log
 * Formato: miniEstufaFelipe/leituras {"data_hora": "...", "temperatura": ..., ...}
 */
function parseLogLine(line) {
  try {
    // Separa o tópico MQTT do JSON
    const parts = line.split(' ');
    const jsonStr = parts.slice(1).join(' ');
    const data = JSON.parse(jsonStr);
    
    return {
      dataHora: data.data_hora,
      temperatura: data.temperatura,
      umidadeAr: data.umidade_ar,
      luminosidade: data.luminosidade,
      umidadeSolo: data.umidade_solo,
      umidadeSoloBruto: data.umidade_solo_bruto,
      statusBomba: data.status_bomba,
    };
  } catch (error) {
    console.error('Erro ao parsear linha:', line, error);
    return null;
  }
}

/**
 * Converte dados parseados para o formato do dashboard
 */
function formatForDashboard(parsedData) {
  // Extrai apenas hora e minuto da data
  const [datePart, timePart] = parsedData.dataHora.split(' ');
  const [hora, minuto] = timePart.split(':');
  const timeLabel = `${hora}:${minuto}`;
  
  return {
    t: timeLabel,
    temp: parsedData.temperatura,
    hum: parsedData.umidadeAr,
    light: parsedData.luminosidade,
    soil: parsedData.umidadeSolo,
    bomba: parsedData.statusBomba === "Bomba ativada",
    // Mantém dados extras para referência futura
    _raw: {
      dataHoraCompleta: parsedData.dataHora,
      umidadeSoloBruto: parsedData.umidadeSoloBruto,
    }
  };
}

/**
 * Processa todas as linhas do arquivo
 */
export function parseDataFile(fileContent) {
  const lines = fileContent.trim().split('\n');
  const parsed = lines
    .map(parseLogLine)
    .filter(item => item !== null)
    .map(formatForDashboard);
  
  return parsed;
}

/**
 * Agrupa dados por hora (média dos valores)
 * Útil para reduzir a quantidade de pontos no gráfico
 */
export function aggregateByHour(data) {
  const grouped = {};
  
  data.forEach(item => {
    const hour = item.t.split(':')[0];
    if (!grouped[hour]) {
      grouped[hour] = {
        items: [],
        t: `${hour}:00`
      };
    }
    grouped[hour].items.push(item);
  });
  
  return Object.values(grouped).map(group => {
    const items = group.items;
    const avg = (key) => items.reduce((sum, item) => sum + item[key], 0) / items.length;
    
    return {
      t: group.t,
      temp: Number(avg('temp').toFixed(1)),
      hum: Number(avg('hum').toFixed(1)),
      light: Number(avg('light').toFixed(0)),
      soil: Number(avg('soil').toFixed(0)),
      bomba: items.some(i => i.bomba), // Se bomba foi ativada em algum momento da hora
    };
  });
}

/**
 * Filtra dados por intervalo de datas
 * Preparado para futura implementação de filtros de período
 */
export function filterByDateRange(data, startDate, endDate) {
  return data.filter(item => {
    const itemDate = new Date(item._raw?.dataHoraCompleta || '2025-01-01');
    return itemDate >= startDate && itemDate <= endDate;
  });
}

/**
 * Pega os últimos N registros
 * Útil para mostrar apenas dados recentes
 */
export function getLastNReadings(data, n = 24) {
  return data.slice(-n);
}

