import React, { useMemo, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChartPanel from "../components/ChartPanel";
import RealtimeSensorDisplay from "../components/RealtimeSensorDisplay";
import { useSupabaseHistory } from "../hooks/useSupabaseHistory";

const formatDateInputValue = (date) => {
  if (!date) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const getLast24hRange = () => {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return {
    start: formatDateInputValue(dayAgo),
    end: formatDateInputValue(now),
  };
};

export default function Dashboard(){
  const [dateInputs, setDateInputs] = useState(() => getLast24hRange());
  const [dateFilter, setDateFilter] = useState(() => getLast24hRange());

  const startDate = useMemo(() => (dateFilter.start ? new Date(dateFilter.start) : null), [dateFilter.start]);
  const endDate = useMemo(() => (dateFilter.end ? new Date(dateFilter.end) : null), [dateFilter.end]);

  const {
    series,
    loading,
    error,
    refresh,
    rangeLabel,
  } = useSupabaseHistory({
    startDate,
    endDate,
  });

  const hasPendingDateChanges = useMemo(
    () => dateInputs.start !== dateFilter.start || dateInputs.end !== dateFilter.end,
    [dateInputs, dateFilter],
  );

  const handleDateChange = useCallback((field) => (event) => {
    setDateInputs((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    setDateFilter(dateInputs);
  }, [dateInputs]);

  const handleClearFilters = useCallback(() => {
    const defaultRange = getLast24hRange();
    setDateInputs(defaultRange);
    setDateFilter(defaultRange);
  }, []);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header onToday={refresh} isLoading={loading} />

        {error && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-xl text-red-600">
            <p className="font-semibold">Não foi possível carregar o histórico.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        )}

        {/* Dados em tempo real */}
        <section className="mb-6">
          <RealtimeSensorDisplay />
        </section>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Leituras</h2>

        {/* Filtros de data */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-soft">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Filtro de Período
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex flex-col text-sm text-gray-600">
              Início
              <input
                type="datetime-local"
                value={dateInputs.start}
                onChange={handleDateChange("start")}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </label>
            <label className="flex flex-col text-sm text-gray-600">
              Fim
              <input
                type="datetime-local"
                value={dateInputs.end}
                onChange={handleDateChange("end")}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </label>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex-1 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 transition"
                disabled={loading || !hasPendingDateChanges}
              >
                {loading ? "Carregando..." : "Aplicar"}
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
                disabled={loading}
              >
                Limpar
              </button>
            </div>
          </div>
          {(dateFilter.start || dateFilter.end) && (
            <p className="text-xs text-gray-500 mt-2">
              Intervalo aplicado:{" "}
              {dateFilter.start ? new Date(dateFilter.start).toLocaleString("pt-BR") : "início livre"}{" "}
              →{" "}
              {dateFilter.end ? new Date(dateFilter.end).toLocaleString("pt-BR") : "fim livre"}
            </p>
          )}
        </section>
        
        {/* Resumo do período selecionado */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Intervalo carregado</div>
              <div className="text-lg font-bold text-gray-800">
                {rangeLabel}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Leituras retornadas: <span className="font-semibold">{series.length}</span>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <ChartPanel
          data={series}
          selected="all"
          loading={loading}
          rangeLabel={rangeLabel}
        />
      </main>
    </div>
  );
}
