const fs = require('fs');

const content = fs.readFileSync('public/miniEstufa 11-14.txt', 'utf-8');
const lines = content.trim().split('\n');

const parsed = lines.map(line => {
  try {
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
      bomba: data.status_bomba === 'Bomba ativada',
      dataHora: data.data_hora
    };
  } catch (e) {
    return null;
  }
}).filter(x => x !== null);

// Agrupa por hora para reduzir dados
const byHour = {};
parsed.forEach(item => {
  const hour = item.t.split(':')[0];
  if (!byHour[hour]) byHour[hour] = [];
  byHour[hour].push(item);
});

const aggregated = Object.keys(byHour).sort((a, b) => parseInt(a) - parseInt(b)).map(hour => {
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

// Pega amostra balanceada
const sample = aggregated.filter((_, i) => i % 2 === 0);

console.log(JSON.stringify(sample, null, 2));

