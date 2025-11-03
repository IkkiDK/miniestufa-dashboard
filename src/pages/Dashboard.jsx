import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ChartPanel from "../components/ChartPanel";
import SensorPicker from "../components/SensorPicker";
import BombaStatus from "../components/BombaStatus";
import { BASE_SERIES, SENSOR_META } from "../data/mock";
import { useRotatingData } from "../hooks/useRotatingData";

export default function Dashboard(){
  const [selected, setSelected] = useState("all");
  const { data, reset } = useRotatingData(BASE_SERIES, 10000); // 10s por leitura (simulando 10 min)

  // valores atuais (último ponto) e anteriores (penúltimo) para deltas:
  const last = data[data.length - 1] || BASE_SERIES[BASE_SERIES.length - 1];
  const prev = data[data.length - 2] || last;

  // KPIs calculados a partir da série rotativa:
  const kpis = useMemo(() => {
    const pct = (now, before) => {
      if (!before || before === 0) return 0;
      return ((now - before) / before) * 100;
    };
    return [
      { title: SENSOR_META.temp.label,  value: last.temp,  unit: SENSOR_META.temp.unit,  delta: pct(last.temp,  prev.temp)  },
      { title: SENSOR_META.hum.label,   value: last.hum,   unit: SENSOR_META.hum.unit,   delta: pct(last.hum,   prev.hum)   },
      { title: SENSOR_META.light.label, value: last.light, unit: SENSOR_META.light.unit, delta: pct(last.light, prev.light) },
      { title: SENSOR_META.soil.label,  value: last.soil,  unit: SENSOR_META.soil.unit,  delta: pct(last.soil,  prev.soil)  },
    ];
  }, [last, prev]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header onToday={reset} />
        
        {/* Indicador de Data e Hora Atual */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Leitura Atual</div>
                <div className="text-lg font-bold text-gray-800">{last.dataCompleta || `${last.data} às ${last.t}`}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Próxima atualização</div>
              <div className="text-sm font-medium text-blue-600">em 10s</div>
            </div>
          </div>
        </div>
        
        {/* KPIs dos sensores */}
        <section className="grid grid-cols-12 gap-4 mb-4">
          {kpis.map((k, i)=>(
            <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <StatCard {...k} />
            </div>
          ))}
        </section>

        {/* Status da bomba de irrigação */}
        <div className="mb-4">
          <BombaStatus ativa={last.bomba} ultimaAtualizacao={last.t} />
        </div>

        {/* Picker de sensor */}
        <SensorPicker value={selected} onChange={setSelected} />

        {/* Gráfico */}
        <ChartPanel data={data} selected={selected} />
      </main>
    </div>
  );
}
