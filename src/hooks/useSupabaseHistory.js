import { useCallback, useEffect, useMemo, useState } from 'react';
import config from '../config';
import getSupabaseClient from '../services/supabaseClient';
import {
  buildHistorySeries,
  buildTimeRangeLabel,
  calculateKpis,
} from '../utils/dataParser';

const TIMEZONE = 'America/Sao_Paulo';

const pad = (value) => value.toString().padStart(2, '0');

const toDateObject = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatTimestampForSupabase = (value) => {
  const date = toDateObject(value);
  if (!date) return null;

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  const year = parts.year ?? '0000';
  const month = pad(Number.parseInt(parts.month ?? '1', 10));
  const day = pad(Number.parseInt(parts.day ?? '1', 10));
  const hour = pad(Number.parseInt(parts.hour ?? '0', 10));
  const minute = pad(Number.parseInt(parts.minute ?? '0', 10));
  const second = pad(Number.parseInt(parts.second ?? '0', 10));

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

export function useSupabaseHistory(options = {}) {
  const {
    limit = null,
    startDate,
    endDate,
  } = options;
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    const table = config.supabase.historyTable;

    if (!table) {
      setError(new Error('Nome da tabela do Supabase não configurado.'));
      setSeries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const supabase = getSupabaseClient();
      let query = supabase
        .from(table)
        .select('*');

      const startFilter = formatTimestampForSupabase(startDate);
      const endFilter = formatTimestampForSupabase(endDate);

      if (startFilter) {
        query = query.gte('data_hora', startFilter);
      }

      if (endFilter) {
        query = query.lte('data_hora', endFilter);
      }

      query = query.order('data_hora', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      const normalized = buildHistorySeries(data ?? []);
      setSeries(normalized);
    } catch (err) {
      console.error('Erro ao buscar histórico no Supabase:', err);
      setError(err);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, [limit, startDate, endDate]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const lastReading = series.at(-1) ?? null;
  const previousReading = series.length > 1 ? series.at(-2) : null;

  const kpis = useMemo(() => calculateKpis(series), [series]);
  const rangeLabel = useMemo(() => buildTimeRangeLabel(series), [series]);

  return {
    series,
    loading,
    error,
    refresh: fetchHistory,
    lastReading,
    previousReading,
    kpis,
    rangeLabel,
    isEmpty: series.length === 0,
  };
}

export default useSupabaseHistory;


