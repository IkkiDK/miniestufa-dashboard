import { useMiniEstufa } from '../hooks/useWebSocket';

/**
 * Componente de exemplo mostrando como usar dados em tempo real da API
 * 
 * Este componente se conecta automaticamente ao WebSocket da API
 * e exibe os dados dos sensores em tempo real.
 */
export default function RealtimeSensorDisplay() {
  const {
    sensorData,
    connectionStatus,
    isConnected,
    error,
    reconnect,
  } = useMiniEstufa({
    apiUrl: 'ws://localhost:8080/ws',
    reconnect: true,
    reconnectInterval: 5000,
  });

  // Status da conexão com cores
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-gray-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '🟢 Conectado';
      case 'connecting': return '🟡 Conectando...';
      case 'disconnected': return '⚪ Desconectado';
      case 'error': return '🔴 Erro';
      default: return '⚪ Desconhecido';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Cabeçalho com status */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📡 Dados em Tempo Real
        </h2>
        <div className="flex items-center gap-3">
          <span className={`font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          {connectionStatus === 'error' && (
            <button
              onClick={reconnect}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              🔄 Reconectar
            </button>
          )}
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-semibold">❌ Erro de Conexão</p>
          <p className="text-red-600 text-sm mt-1">
            Verifique se o servidor está rodando em ws://localhost:8080/ws
          </p>
        </div>
      )}

      {/* Dados dos sensores */}
      {isConnected && sensorData ? (
        <div className="space-y-4">
          {/* Data e Hora */}
          <div className="text-center pb-4 border-b">
            <p className="text-sm text-gray-500">Última atualização</p>
            <p className="text-lg font-mono font-semibold text-gray-700">
              {sensorData.dataHora}
            </p>
          </div>

          {/* Grid de sensores */}
          <div className="grid grid-cols-2 gap-4">
            {/* Temperatura */}
            <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌡️</span>
                <p className="text-sm font-semibold text-gray-600">Temperatura</p>
              </div>
              <p className="text-3xl font-bold text-red-600">
                {sensorData.temperatura.toFixed(1)}°C
              </p>
            </div>

            {/* Umidade do Ar */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💧</span>
                <p className="text-sm font-semibold text-gray-600">Umidade do Ar</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {sensorData.umidadeAr.toFixed(1)}%
              </p>
            </div>

            {/* Luminosidade */}
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">☀️</span>
                <p className="text-sm font-semibold text-gray-600">Luminosidade</p>
              </div>
              <p className="text-3xl font-bold text-yellow-600">
                {sensorData.luminosidade}%
              </p>
            </div>

            {/* Umidade do Solo */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌱</span>
                <p className="text-sm font-semibold text-gray-600">Umidade do Solo</p>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {sensorData.umidadeSolo}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Bruto: {sensorData.umidadeSoloBruto}
              </p>
            </div>
          </div>

          {/* Status da Bomba */}
          <div className={`p-4 rounded-lg border ${
            sensorData.bombaAtiva 
              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300' 
              : 'bg-gray-50 border-gray-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {sensorData.bombaAtiva ? '🚿' : '⭕'}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Bomba d'água</p>
                  <p className={`text-xl font-bold ${
                    sensorData.bombaAtiva ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {sensorData.statusBomba}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full font-semibold ${
                sensorData.bombaAtiva 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {sensorData.bombaAtiva ? 'ATIVA' : 'INATIVA'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-500">
            {connectionStatus === 'connecting' 
              ? 'Conectando ao servidor...' 
              : 'Aguardando dados...'}
          </p>
        </div>
      )}
    </div>
  );
}

