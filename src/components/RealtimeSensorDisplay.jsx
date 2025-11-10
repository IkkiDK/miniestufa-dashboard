import { useMiniEstufa } from '../hooks/useWebSocket';
import config from '../config';

const NO_DATA_LABEL = 'dado não recebido';

const renderMetricValue = (display, suffix = '') => {
  if (!display || display === NO_DATA_LABEL) {
    return NO_DATA_LABEL;
  }

  return `${display}${suffix}`;
};

const metricCardClass = (baseClasses, hasData) => {
  if (hasData) {
    return baseClasses;
  }
  return `${baseClasses} opacity-50 border-dashed`;
};

const renderMetricIcon = (icon, hasData) => (hasData ? icon : '❔');

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
    apiUrl: config.wsUrl,
    reconnect: config.reconnect.enabled,
    reconnectInterval: config.reconnect.interval,
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

  const bombaSemDados = sensorData?.bombaAtiva === null || sensorData?.statusBomba === NO_DATA_LABEL;
  const bombaAtiva = sensorData?.bombaAtiva === true;

  const luzSemDados = sensorData?.luzLigada === null || sensorData?.statusLuz === NO_DATA_LABEL;
  const luzLigada = sensorData?.luzLigada === true;

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
            Verifique se o servidor está rodando em {config.wsUrl}
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
              {sensorData.dataHora || NO_DATA_LABEL}
            </p>
            <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
              {sensorData.tipo && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                  <span className="font-semibold uppercase">Tipo:</span> {sensorData.tipo}
                </span>
              )}
              {sensorData.idx !== null && sensorData.idx !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                  <span className="font-semibold uppercase">Índice:</span> {sensorData.idx}
                </span>
              )}
            </div>
            {sensorData.topico && (
              <p className="text-xs text-gray-400 mt-1">
                Tópico: {sensorData.topico}
              </p>
            )}
          </div>

          {/* Valores principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Temperatura */}
            <div className={metricCardClass(
              "p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200",
              sensorData.temperaturaDisplay && sensorData.temperaturaDisplay !== NO_DATA_LABEL,
            )}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {renderMetricIcon('🌡️', sensorData.temperaturaDisplay && sensorData.temperaturaDisplay !== NO_DATA_LABEL)}
                </span>
                <p className="text-sm font-semibold text-gray-600">Temperatura</p>
              </div>
              <p className="text-3xl font-bold text-red-600">
                {renderMetricValue(sensorData.temperaturaDisplay, '°C')}
              </p>
            </div>

            {/* Umidade do Ar */}
            <div className={metricCardClass(
              "p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200",
              sensorData.umidadeArDisplay && sensorData.umidadeArDisplay !== NO_DATA_LABEL,
            )}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {renderMetricIcon('💧', sensorData.umidadeArDisplay && sensorData.umidadeArDisplay !== NO_DATA_LABEL)}
                </span>
                <p className="text-sm font-semibold text-gray-600">Umidade do Ar</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {renderMetricValue(sensorData.umidadeArDisplay, '%')}
              </p>
            </div>

            {/* Luminosidade */}
            <div className={metricCardClass(
              "p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200",
              sensorData.luminosidadeDisplay && sensorData.luminosidadeDisplay !== NO_DATA_LABEL,
            )}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {renderMetricIcon('☀️', sensorData.luminosidadeDisplay && sensorData.luminosidadeDisplay !== NO_DATA_LABEL)}
                </span>
                <p className="text-sm font-semibold text-gray-600">Luminosidade</p>
              </div>
              <p className="text-3xl font-bold text-yellow-600">
                {renderMetricValue(sensorData.luminosidadeDisplay, '%')}
              </p>
            </div>

            {/* Umidade do Solo */}
            <div className={metricCardClass(
              "p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200",
              sensorData.umidadeSoloDisplay && sensorData.umidadeSoloDisplay !== NO_DATA_LABEL,
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {renderMetricIcon('🌱', sensorData.umidadeSoloDisplay && sensorData.umidadeSoloDisplay !== NO_DATA_LABEL)}
                  </span>
                  <p className="text-sm font-semibold text-gray-600">Umidade do Solo</p>
                </div>
                <span className="text-[11px] uppercase tracking-wide text-green-700 font-semibold bg-green-100 px-2 py-0.5 rounded-full">
                  {sensorData.umidadeSoloBrutoDisplay || NO_DATA_LABEL}
                </span>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {renderMetricValue(sensorData.umidadeSoloDisplay, '%')}
              </p>
              <p className="text-xs text-green-700 mt-1 font-medium">
                Valor bruto (ADC): {sensorData.umidadeSoloBrutoDisplay || NO_DATA_LABEL}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status da Bomba */}
            <div className={metricCardClass(
              `p-4 rounded-lg border transition ${
                bombaAtiva
                  ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 shadow-sm'
                  : 'bg-white border-gray-200'
              }`,
              !bombaSemDados,
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-3xl ${bombaAtiva ? 'animate-pulse' : ''}`}>
                    {renderMetricIcon(bombaAtiva ? '🚿' : '💧', !bombaSemDados)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Bomba d'água</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {sensorData.statusBomba || NO_DATA_LABEL}
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wide ${
                  bombaSemDados
                    ? 'bg-slate-100 border border-dashed border-slate-300 text-slate-400'
                    : bombaAtiva
                      ? 'bg-blue-100 border border-blue-200 text-blue-700'
                      : 'bg-slate-100 border border-slate-200 text-slate-500'
                }`}>
                  {bombaSemDados ? NO_DATA_LABEL : (bombaAtiva ? 'Ativa' : 'Desativada')}
                </div>
              </div>
            </div>

            {/* Status da Iluminação */}
            <div className={metricCardClass(
              `p-4 rounded-lg border transition ${
                luzLigada
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-100 border-amber-200 shadow-sm'
                  : 'bg-white border-gray-200'
              }`,
              !luzSemDados,
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {renderMetricIcon(luzLigada ? '💡' : '💤', !luzSemDados)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Iluminação</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {sensorData.statusLuz || NO_DATA_LABEL}
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wide ${
                  luzSemDados
                    ? 'bg-slate-100 border border-dashed border-slate-300 text-slate-400'
                    : luzLigada
                      ? 'bg-amber-100 border border-amber-200 text-amber-700'
                      : 'bg-slate-100 border border-slate-200 text-slate-500'
                }`}>
                  {luzSemDados ? NO_DATA_LABEL : (luzLigada ? 'Ligada' : 'Desligada')}
                </div>
              </div>
            </div>

            {/* Informações adicionais */}
            <div />
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

