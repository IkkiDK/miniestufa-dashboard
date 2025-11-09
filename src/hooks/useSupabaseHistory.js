import { useCallback, useEffect, useMemo, useState } from 'react';
import config from '../config';
import getSupabaseClient from '../services/supabaseClient';
import {
  buildHistorySeries,
  buildTimeRangeLabel,
  calculateKpis,
} from '../utils/dataParser';

const toIsoString = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
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

      const startIso = toIsoString(startDate);
      const endIso = toIsoString(endDate);

      if (startIso) {
        query = query.gte('data_hora', startIso);
      }

      if (endIso) {
        query = query.lte('data_hora', endIso);
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


