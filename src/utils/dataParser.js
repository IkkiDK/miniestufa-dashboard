const numberOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toDate = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const formatTime = (date) => {
  if (!date) return '';
  return date.toLocaleTimeString('pt-BR', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateTime = (date) => {
  if (!date) return '';
  const datePart = formatDate(date);
  const timePart = date.toLocaleTimeString('pt-BR', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${datePart} ${timePart}`;
};

const includesKeyword = (value, keyword) => {
  if (!value) return false;
  return value.toLowerCase().includes(keyword.toLowerCase());
};

export function mapSupabaseRow(row) {
  const timestamp = toDate(row.data_hora);
  const dateLabel = formatDate(timestamp);
  const timeLabel = formatTime(timestamp);

  return {
    id: row.id ?? row.idx ?? row.data_hora,
    idx: row.idx ?? null,
    tipo: row.tipo ?? '',
    topico: row.topico ?? '',
    t: timeLabel,
    data: dateLabel,
    dataCompleta: timestamp ? formatDateTime(timestamp) : row.data_hora ?? '',
    dataHoraISO: row.data_hora ?? '',
    temp: numberOrZero(row.temperatura),
    hum: numberOrZero(row.umidade_ar),
    light: numberOrZero(row.luminosidade),
    soil: numberOrZero(row.umidade_solo),
    bomba: includesKeyword(row.status_bomba, 'ativada'),
    statusBomba: row.status_bomba ?? 'Status desconhecido',
    statusLuz: row.status_luz ?? 'Status desconhecido',
    umidadeSoloBruto: numberOrZero(row.umidade_solo_bruto ?? row.solo_bruto),
    timestamp,
    raw: row,
  };
}

export function buildHistorySeries(rows) {
  return rows
    .map(mapSupabaseRow)
    .filter((item) => item.timestamp !== null)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function calculateKpis(series) {
  if (series.length === 0) {
    return [];
  }

  const last = series[series.length - 1];
  const prev = series[series.length - 2] ?? last;

  const pct = (now, before) => {
    if (before === 0) return 0;
    return ((now - before) / before) * 100;
  };

  return [
    { title: 'Temperatura', value: last.temp.toFixed(1), unit: '°C', delta: pct(last.temp, prev.temp) },
    { title: 'Umidade do Ar', value: last.hum.toFixed(1), unit: '%', delta: pct(last.hum, prev.hum) },
    { title: 'Luminosidade', value: last.light.toFixed(0), unit: '%', delta: pct(last.light, prev.light) },
    { title: 'Umidade do Solo', value: last.soil.toFixed(0), unit: '%', delta: pct(last.soil, prev.soil) },
  ];
}

export function buildTimeRangeLabel(series) {
  if (series.length === 0) {
    return 'Sem leituras cadastradas';
  }

  const first = series[0];
  const last = series[series.length - 1];

  if (!first.timestamp || !last.timestamp) {
    return `Total de ${series.length} leituras`;
  }

  const start = first.timestamp.toLocaleString('pt-BR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const end = last.timestamp.toLocaleString('pt-BR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${start} → ${end} • ${series.length} leituras`;
}

export function normalizeRealtimePayload(payload) {
  if (!payload) {
    return null;
  }

  const timestamp = toDate(payload.data_hora);
  const formattedDateTime = timestamp ? formatDateTime(timestamp) : payload.data_hora ?? '';

  return {
    dataHora: formattedDateTime,
    dataHoraISO: payload.data_hora ?? '',
    timestamp,
    idx: payload.idx ?? payload.id ?? null,
    temperatura: numberOrZero(payload.temperatura),
    umidadeAr: numberOrZero(payload.umidade_ar),
    luminosidade: numberOrZero(payload.luminosidade),
    umidadeSolo: numberOrZero(payload.umidade_solo),
    umidadeSoloBruto: payload.umidade_solo_bruto ?? payload.solo_bruto ?? null,
    statusBomba: payload.status_bomba ?? 'Status desconhecido',
    bombaAtiva: includesKeyword(payload.status_bomba, 'ativada'),
    statusLuz: payload.status_luz ?? 'Status desconhecido',
    topico: payload.topico ?? '',
    tipo: payload.tipo ?? '',
  };
}

