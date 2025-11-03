const fs = require('fs');

const content = fs.readFileSync('public/miniEstufa 11-14.txt', 'utf-8');
const lines = content.trim().split('\n');

const parsed = lines.map(line => {
  try {
    const parts = line.split(' ');
    const jsonStr = parts.slice(1).join(' ');
    const data = JSON.parse(jsonStr);
    const [datePart, timePart] = data.data_hora.split(' ');
    const [dia, mes, ano] = datePart.split('/');
    const [hora, minuto] = timePart.split(':');
    
    return {
      t: `${hora}:${minuto}`,
      data: `${dia}/${mes}`,
      dataCompleta: data.data_hora,
      temp: data.temperatura,
      hum: data.umidade_ar,
      light: data.luminosidade,
      soil: data.umidade_solo,
      bomba: data.status_bomba === 'Bomba ativada'
    };
  } catch (e) {
    return null;
  }
}).filter(x => x !== null);

// Pega uma amostra a cada 3 leituras (~30 minutos) para ter ~160 pontos
const sample = parsed.filter((_, i) => i % 3 === 0);

// Gera o conteúdo do arquivo JavaScript
const jsContent = `// Dados reais da mini estufa (11-14 out/2025)
// Leituras a cada ~30 minutos (488 leituras originais, 160 pontos na amostra)
// Futuramente, estes dados serão substituídos por API em tempo real
export const BASE_SERIES = ${JSON.stringify(sample, null, 2)};

export const COLORS = {
  temp: "#1a1a2e",   // brand
  hum:  "#16a34a",   // accent
  light:"#0ea5e9",   // azul
  soil: "#f59e0b",   // laranja
};

export const SENSOR_META = {
  all:   { label: "Todos",           unit: ""   },
  temp:  { label: "Temperatura",     unit: "°C" },
  hum:   { label: "Umidade do Ar",   unit: "%"  },
  light: { label: "Luminosidade",    unit: "%"  },
  soil:  { label: "Umidade do Solo", unit: "%"  },
  bomba: { label: "Status da Bomba", unit: ""   },
};
`;

// Salva o arquivo
fs.writeFileSync('src/data/mock.jsx', jsContent, 'utf-8');

console.log(`✅ Arquivo gerado com sucesso!`);
console.log(`Total de leituras originais: ${parsed.length}`);
console.log(`Pontos na amostra: ${sample.length}`);
console.log(`Período: ${sample[0].dataCompleta} até ${sample[sample.length-1].dataCompleta}`);

