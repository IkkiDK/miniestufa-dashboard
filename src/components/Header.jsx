import React from "react";

export default function Header({ onToday, isLoading }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard da Mini Estufa</h1>
        <p className="text-sm text-gray-500 mt-1">Monitoramento de sensores em tempo real</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToday}
          disabled={isLoading}
          className={`bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 active:translate-y-px transition ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Atualizando..." : "Atualizar"}
        </button>
      </div>
    </div>
  );
}
