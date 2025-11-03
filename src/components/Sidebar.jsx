import React from "react";
import { Home, BarChart3, SlidersHorizontal } from "lucide-react";

export default function Sidebar(){
  return (
    <aside className="w-64 min-h-screen bg-brand text-white p-6 flex flex-col shadow-soft">
      <div className="mb-8">
        <div className="text-4xl mb-2">🌱</div>
        <h2 className="text-xl font-extrabold tracking-wide">Mini Estufa</h2>
        <p className="text-xs text-white/60 mt-1">Sistema Inteligente</p>
      </div>
      <nav className="flex flex-col gap-2">
        <a className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition">
          <Home size={18}/> Dashboard
        </a>
        <a className="flex items-center gap-2 px-3 py-2 rounded-lg hover:text-accent transition">
          <BarChart3 size={18}/> Sensores
        </a>
        <a className="flex items-center gap-2 px-3 py-2 rounded-lg hover:text-accent transition">
          <SlidersHorizontal size={18}/> Configurações
        </a>
      </nav>
      <div className="mt-auto text-xs text-white/70 pt-6 border-t border-white/10">
        <div className="mt-3 mb-1">v1.0 • Dados históricos</div>
        <div className="text-[10px]">Período: 11-14 out/2025</div>
        <div className="text-[10px] mt-1">Leituras a cada 10 min</div>
      </div>
    </aside>
  );
}
