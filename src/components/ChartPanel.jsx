import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { COLORS, SENSOR_META } from "../data/mock";

export default function ChartPanel({ data, selected }) {
  const show = (key) => selected === "all" || selected === key;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-soft">
      <h3 className="font-semibold mb-1">
        {selected === "all" ? "Histórico de Sensores - Mini Estufa" : SENSOR_META[selected].label}
      </h3>
      <div className="text-xs text-gray-500 mb-3">
        Período: 11 a 14 de outubro de 2025 • {data.length} leituras exibidas • Intervalo: ~30 min
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis />
          <Tooltip />
          {selected === "all" && <Legend />}
          {show("temp")  && <Line type="monotone" dataKey="temp"  name="Temperatura (°C)"      stroke={COLORS.temp}  strokeWidth={selected==="temp"?3:2} dot={false} />}
          {show("hum")   && <Line type="monotone" dataKey="hum"   name="Umidade do Ar (%)"    stroke={COLORS.hum}   strokeWidth={selected==="hum"?3:2}  dot={false} />}
          {show("light") && <Line type="monotone" dataKey="light" name="Luminosidade (%)"     stroke={COLORS.light} strokeWidth={selected==="light"?3:2}dot={false} />}
          {show("soil")  && <Line type="monotone" dataKey="soil"  name="Umidade do Solo (%)"  stroke={COLORS.soil}  strokeWidth={selected==="soil"?3:2} dot={false} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
