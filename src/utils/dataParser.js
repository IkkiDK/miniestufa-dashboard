const numberOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const LOCALE_TIMEZONE = 'America/Sao_Paulo';
const BR_DATE_TIME_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/;
const ISO_LOCAL_REGEX = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/;

const toNumber = (value) => Number.parseInt(value, 10);

const getTimeZoneOffsetMs = (timeZone, date) => {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const parts = dtf.formatToParts(date);
  const lookup = parts.reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = toNumber(part.value);
    }
    return acc;
  }, {});

  const asUtc = Date.UTC(
    lookup.year ?? 0,
    (lookup.month ?? 1) - 1,
    lookup.day ?? 1,
    lookup.hour ?? 0,
    lookup.minute ?? 0,
    lookup.second ?? 0,
  );

  return asUtc - date.getTime();
};

const buildZonedDate = (components) => {
  const {
    year, month, day, hour, minute, second = 0,
  } = components;

  if (
    Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)
    || Number.isNaN(hour) || Number.isNaN(minute) || Number.isNaN(second)
  ) {
    return null;
  }

  const baseUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const offset = getTimeZoneOffsetMs(LOCALE_TIMEZONE, baseUtc);
  return new Date(baseUtc.getTime() - offset);
};

const toDate = (value) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const brMatches = trimmed.match(BR_DATE_TIME_REGEX);
    if (brMatches) {
      const [, dd, mm, yyyy, hh, min, ss] = brMatches;
      return buildZonedDate({
        year: toNumber(yyyy),
        month: toNumber(mm),
        day: toNumber(dd),
        hour: toNumber(hh),
        minute: toNumber(min),
        second: ss ? toNumber(ss) : 0,
      });
    }

    const isoMatches = trimmed.match(ISO_LOCAL_REGEX);
    if (isoMatches) {
      const [, yyyy, mm, dd, hh, min, ss] = isoMatches;
      return buildZonedDate({
        year: toNumber(yyyy),
        month: toNumber(mm),
        day: toNumber(dd),
        hour: toNumber(hh),
        minute: toNumber(min),
        second: ss ? toNumber(ss) : 0,
      });
    }
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return buildZonedDate({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
  });
};

const formatDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('pt-BR', { timeZone: LOCALE_TIMEZONE });
};

const formatTime = (date) => {
  if (!date) return '';
  return date.toLocaleTimeString('pt-BR', {
    timeZone: LOCALE_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateTime = (date) => {
  if (!date) return '';
  const datePart = formatDate(date);
  const timePart = date.toLocaleTimeString('pt-BR', {
    timeZone: LOCALE_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${datePart} ${timePart}`;
};

const isActiveStatus = (value) => {
  if (!value) return false;
  const normalized = value.toString().trim().toLowerCase();

  if (normalized === '1' || normalized === 'true' || normalized === 'on') {
    return true;
  }

  if (normalized === '0' || normalized === 'false' || normalized === 'off') {
    return false;
  }

  if (
    normalized.includes('desativ') ||
    normalized.includes('deslig') ||
    normalized.includes('inativ')
  ) {
    return false;
  }

  if (normalized.includes('ativ') || normalized.includes('lig')) {
    return true;
  }

  return false;
};

export function mapSupabaseRow(row) {
  const timestamp = toDate(row.data_hora);
  const dateLabel = formatDate(timestamp);
  const timeLabel = formatTime(timestamp);

  const statusBombaOriginal = row.status_bomba ?? '';
  const statusLuzOriginal = row.status_luz ?? '';

  const bombaAtiva = isActiveStatus(statusBombaOriginal);
  const luzLigada = isActiveStatus(statusLuzOriginal);

  const statusBombaLabel = bombaAtiva ? "Bomba ativada" : "Bomba desativada";
  const statusLuzLabel = luzLigada ? "Luz ligada" : "Luz desligada";

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
    soilRaw: numberOrZero(row.umidade_solo_bruto ?? row.solo_bruto),
    bomba: bombaAtiva,
    luz: luzLigada,
    statusBomba: statusBombaOriginal || statusBombaLabel,
    statusLuz: statusLuzOriginal || statusLuzLabel,
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
    timeZone: LOCALE_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const end = last.timestamp.toLocaleString('pt-BR', {
    timeZone: LOCALE_TIMEZONE,
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

  const statusBombaOriginal = payload.status_bomba ?? '';
  const statusLuzOriginal = payload.status_luz ?? '';

  const bombaAtiva = isActiveStatus(statusBombaOriginal);
  const luzLigada = isActiveStatus(statusLuzOriginal);

  const statusBombaLabel = bombaAtiva ? "Bomba ativada" : "Bomba desativada";
  const statusLuzLabel = luzLigada ? "Luz ligada" : "Luz desligada";

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
    statusBomba: statusBombaOriginal || statusBombaLabel,
    bombaAtiva,
    statusLuz: statusLuzOriginal || statusLuzLabel,
    luzLigada,
    topico: payload.topico ?? '',
    tipo: payload.tipo ?? '',
  };
}

