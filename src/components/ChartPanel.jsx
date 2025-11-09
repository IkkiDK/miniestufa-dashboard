import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { SENSOR_COLORS, SENSOR_META } from "../constants/sensors";

export default function ChartPanel({ data, selected, loading, rangeLabel }) {
  const show = (key) => selected === "all" || selected === key;
  const hasData = data.length > 0;

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
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis />
          <Tooltip />
          {selected === "all" && <Legend />}
          {show("temp")  && <Line type="monotone" dataKey="temp"  name="Temperatura (°C)"      stroke={SENSOR_COLORS.temp}  strokeWidth={selected==="temp"?3:2} dot={false} />}
          {show("hum")   && <Line type="monotone" dataKey="hum"   name="Umidade do Ar (%)"    stroke={SENSOR_COLORS.hum}   strokeWidth={selected==="hum"?3:2}  dot={false} />}
          {show("light") && <Line type="monotone" dataKey="light" name="Luminosidade (%)"     stroke={SENSOR_COLORS.light} strokeWidth={selected==="light"?3:2} dot={false} />}
          {show("soil")  && <Line type="monotone" dataKey="soil"  name="Umidade do Solo (%)"  stroke={SENSOR_COLORS.soil}  strokeWidth={selected==="soil"?3:2} dot={false} />}
        </LineChart>
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
