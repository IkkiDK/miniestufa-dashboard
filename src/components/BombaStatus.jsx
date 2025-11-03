import React from "react";
import { Droplet, DropletOff } from "lucide-react";

/**
 * Componente para exibir o status da bomba de irrigação
 * Preparado para receber dados em tempo real no futuro
 */
export default function BombaStatus({ ativa, ultimaAtualizacao }) {
  return (
    <div className={`border rounded-2xl p-5 shadow-soft ${ativa ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"}`}>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${ativa ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"}`}>
          {ativa ? <Droplet size={24} /> : <DropletOff size={24} />}
        </div>
        
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">
            Sistema de Irrigação
          </div>
          <div className={`text-lg font-bold mt-0.5 ${ativa ? "text-blue-600" : "text-gray-600"}`}>
            {ativa ? "Bomba Ativada" : "Bomba Desativada"}
          </div>
          {ultimaAtualizacao && (
            <div className="text-xs text-gray-400 mt-1">
              Última atualização: {ultimaAtualizacao}
            </div>
          )}
        </div>

        {ativa && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs text-blue-600 font-medium">Em operação</span>
          </div>
        )}
      </div>
    </div>
  );
}

