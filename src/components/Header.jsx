import React from "react";

export default function Header({ onToday }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard da Mini Estufa</h1>
        <p className="text-sm text-gray-500 mt-1">Monitoramento de sensores em tempo real</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Pesquisar..."
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button onClick={onToday} className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 active:translate-y-px transition">
          Reiniciar
        </button>
      </div>
    </div>
  );
}
