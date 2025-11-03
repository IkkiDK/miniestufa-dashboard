import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ title, value, unit, delta }){
  const up = delta >= 0;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-soft">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{title}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      <div className={`mt-2 text-sm flex items-center gap-1 ${up ? "text-accent" : "text-red-500"}`}>
        {up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
        {Math.abs(delta).toFixed(1)}% vs. hora anterior
      </div>
    </div>
  );
}
