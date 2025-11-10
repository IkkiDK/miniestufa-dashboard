import React, { useMemo } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import { SENSOR_COLORS, SENSOR_META } from "../constants/sensors";

const NO_DATA_LABEL = 'dado não recebido';

const STATUS_COLORS = {
  bomba: "rgba(37, 99, 235, 0.18)",
  luz: "rgba(250, 204, 21, 0.18)",
};

function formatStatus(value, activeLabel, inactiveLabel) {
  if (value === null || value === undefined) {
    return NO_DATA_LABEL;
  }

  return value ? activeLabel : inactiveLabel;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-700">
      <p className="font-semibold text-gray-800 mb-2">{item.dataCompleta}</p>
      <div className="space-y-1">
        <p><span className="font-medium">Temperatura:</span> {item.temp.toFixed(1)} °C</p>
        <p><span className="font-medium">Umidade do Ar:</span> {item.hum.toFixed(1)} %</p>
        <p><span className="font-medium">Luminosidade:</span> {item.light.toFixed(0)} %</p>
        <p><span className="font-medium">Umidade do Solo:</span> {item.soil.toFixed(0)} %</p>
        <p><span className="font-medium">Solo Bruto:</span> {item.soilRaw.toFixed(0)}</p>
        <p><span className="font-medium">Bomba:</span> {formatStatus(item.bomba, "Ativa", "Inativa")}</p>
        <p><span className="font-medium">Luz:</span> {formatStatus(item.luz, "Ligada", "Desligada")}</p>
      </div>
    </div>
  );
}

function CustomLegend({ payload }) {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 text-xs">
      {payload.map((entry) => (
        <span
          key={entry.value}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50"
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color || "#94a3b8" }}
          />
          <span className="font-medium text-gray-600">{entry.value}</span>
        </span>
      ))}
    </div>
  );
}

export default function ChartPanel({ data, selected, loading, rangeLabel }) {
  const hasData = data.length > 0;

  const chartData = useMemo(() => data.map((item) => {
    const bombaFlag = item.bomba === null || item.bomba === undefined ? null : Boolean(item.bomba);
    const luzFlag = item.luz === null || item.luz === undefined ? null : Boolean(item.luz);

    return {
      ...item,
      soilRaw: item.soilRaw ?? item.umidadeSoloBruto ?? 0,
      bomba: bombaFlag,
      luz: luzFlag,
      bombaArea: bombaFlag ? 1 : 0,
      luzArea: luzFlag ? 1 : 0,
    };
  }), [data]);

  const legendPayload = useMemo(() => ([
    { value: "Temperatura (°C)", type: "line", id: "temp", color: SENSOR_COLORS.temp },
    { value: "Umidade do Ar (%)", type: "line", id: "hum", color: SENSOR_COLORS.hum },
    { value: "Luminosidade (%)", type: "line", id: "light", color: SENSOR_COLORS.light },
    { value: "Umidade do Solo (%)", type: "line", id: "soil", color: SENSOR_COLORS.soil },
    { value: "Solo Bruto", type: "line", id: "soilRaw", color: "#8b5cf6" },
    { value: "Bomba Ativa", type: "square", id: "bombaArea", color: "rgba(37, 99, 235, 0.6)" },
    { value: "Luz Ligada", type: "square", id: "luzArea", color: "rgba(250, 204, 21, 0.6)" },
  ]), []);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-soft">
      <h3 className="font-semibold mb-1">
        {selected === "all" ? "Histórico de Sensores - Mini Estufa" : SENSOR_META[selected].label}
      </h3>
      <div className="text-xs text-gray-500 mb-3">
        {rangeLabel || `Total de ${data.length} leituras`}
      </div>
      {loading && !hasData ? (
        <div className="h-80 rounded-xl bg-gray-100 animate-pulse"></div>
      ) : (
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 48, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis
            yAxisId="left"
            domain={[0, 100]}
            label={{ value: "Percentual (%)", angle: -90, position: "insideLeft", offset: 10 }}
          />
          <YAxis
            yAxisId="soilRaw"
            orientation="right"
            allowDecimals={false}
            label={{ value: "Solo Bruto", angle: 90, position: "insideRight" }}
          />
          <YAxis yAxisId="status" hide domain={[0, 1]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend payload={legendPayload} content={<CustomLegend />} />
          <Area
            yAxisId="status"
            type="stepAfter"
            dataKey="bombaArea"
            fill={STATUS_COLORS.bomba}
            stroke="none"
            name="Bomba Ativa"
            isAnimationActive={false}
          />
          <Area
            yAxisId="status"
            type="stepAfter"
            dataKey="luzArea"
            fill={STATUS_COLORS.luz}
            stroke="none"
            name="Luz Ligada"
            isAnimationActive={false}
          />
          <Line yAxisId="left" type="monotone" dataKey="temp" name="Temperatura (°C)" stroke={SENSOR_COLORS.temp} strokeWidth={2} dot={false} />
          <Line yAxisId="left" type="monotone" dataKey="hum" name="Umidade do Ar (%)" stroke={SENSOR_COLORS.hum} strokeWidth={2} dot={false} />
          <Line yAxisId="left" type="monotone" dataKey="light" name="Luminosidade (%)" stroke={SENSOR_COLORS.light} strokeWidth={2} dot={false} />
          <Line yAxisId="left" type="monotone" dataKey="soil" name="Umidade do Solo (%)" stroke={SENSOR_COLORS.soil} strokeWidth={2} dot={false} />
          <Line yAxisId="soilRaw" type="monotone" dataKey="soilRaw" name="Solo Bruto" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
      )}
      {!loading && !hasData && (
        <div className="text-sm text-gray-500 text-center py-10">
          Nenhuma leitura encontrada no Supabase.
        </div>
      )}
    </div>
  );
}
