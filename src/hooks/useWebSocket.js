import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { normalizeRealtimePayload } from '../utils/dataParser';

/**
 * Hook customizado para gerenciar conexão WebSocket com a API da mini estufa
 * 
 * @param {string} url - URL do WebSocket (ex: 'ws://localhost:8080/ws')
 * @param {object} options - Opções de configuração
 * @param {boolean} options.autoConnect - Conectar automaticamente ao montar (default: true)
 * @param {number} options.reconnectInterval - Intervalo de reconexão em ms (default: 5000)
 * @param {boolean} options.reconnect - Tentar reconectar automaticamente (default: true)
 * @param {function} options.onMessage - Callback adicional para mensagens
 * @param {function} options.onError - Callback adicional para erros
 * 
 * @returns {object} Estado e métodos do WebSocket
 */
export function useWebSocket(url, options = {}) {
  const {
    autoConnect = true,
    reconnectInterval = 5000,
    reconnect = true,
    onMessage: onMessageCallback,
    onError: onErrorCallback,
  } = options;

  const [data, setData] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connecting' | 'connected' | 'disconnected' | 'error'
  const [error, setError] = useState(null);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const shouldReconnectRef = useRef(reconnect);

  // Limpa timeout de reconexão
  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Conecta ao WebSocket
  const connect = useCallback(() => {
    try {
      setConnectionStatus('connecting');
      setError(null);
      
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket conectado:', url);
        setConnectionStatus('connected');
        setError(null);
        clearReconnectTimeout();
      };

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setData(parsedData);
          setLastMessage(event);
          
          // Callback adicional se fornecido
          if (onMessageCallback) {
            onMessageCallback(parsedData);
          }
        } catch (err) {
          console.error('❌ Erro ao parsear mensagem WebSocket:', err);
          setError(err);
        }
      };

      ws.onerror = (err) => {
        console.error('❌ Erro WebSocket:', err);
        setConnectionStatus('error');
        setError(err);
        
        // Callback adicional se fornecido
        if (onErrorCallback) {
          onErrorCallback(err);
        }
      };

      ws.onclose = (event) => {
        console.log('⚠️ WebSocket desconectado:', event.code, event.reason);
        setConnectionStatus('disconnected');
        wsRef.current = null;

        // Tenta reconectar se habilitado
        if (shouldReconnectRef.current && reconnect) {
          console.log(`🔄 Tentando reconectar em ${reconnectInterval}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (err) {
      console.error('❌ Erro ao criar WebSocket:', err);
      setConnectionStatus('error');
      setError(err);
    }
  }, [url, reconnect, reconnectInterval, onMessageCallback, onErrorCallback, clearReconnectTimeout]);

  // Desconecta do WebSocket
  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    clearReconnectTimeout();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setConnectionStatus('disconnected');
  }, [clearReconnectTimeout]);

  // Reconecta manualmente
  const reconnectManually = useCallback(() => {
    disconnect();
    shouldReconnectRef.current = true;
    connect();
  }, [connect, disconnect]);

  // Envia mensagem pelo WebSocket
  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = typeof message === 'string' ? message : JSON.stringify(message);
      wsRef.current.send(payload);
      return true;
    } else {
      console.warn('⚠️ WebSocket não está conectado. Mensagem não enviada.');
      return false;
    }
  }, []);

  // Conecta automaticamente ao montar se autoConnect estiver true
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Cleanup ao desmontar
    return () => {
      shouldReconnectRef.current = false;
      clearReconnectTimeout();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [autoConnect, connect, clearReconnectTimeout]);

  return {
    // Estado
    data,                          // Último dado recebido (parseado)
    lastMessage,                   // Última mensagem raw
    connectionStatus,              // Status da conexão
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    isDisconnected: connectionStatus === 'disconnected',
    error,                         // Último erro
    
    // Métodos
    connect,                       // Conecta manualmente
    disconnect,                    // Desconecta
    reconnect: reconnectManually,  // Reconecta manualmente
    sendMessage,                   // Envia mensagem
  };
}

/**
 * Hook especializado para a API da mini estufa
 * Já configurado com a URL e conversões apropriadas
 * 
 * @param {object} options - Opções de configuração
 * @returns {object} Estado dos sensores e métodos de conexão
 */
export function useMiniEstufa(options = {}) {
  // Não define URL padrão aqui - deve ser fornecida pelo componente
  const {
    apiUrl,
    ...wsOptions
  } = options;
  
  if (!apiUrl) {
    throw new Error('apiUrl é obrigatório para useMiniEstufa');
  }

  const websocket = useWebSocket(apiUrl, wsOptions);
  
  // Extrai dados dos sensores com valores padrão
  const sensorData = useMemo(
    () => normalizeRealtimePayload(websocket.data),
    [websocket.data],
  );

  return {
    ...websocket,
    sensorData,           // Dados dos sensores formatados
    temperatura: sensorData?.temperatura,
    umidadeAr: sensorData?.umidadeAr,
    luminosidade: sensorData?.luminosidade,
    umidadeSolo: sensorData?.umidadeSolo,
    bombaAtiva: sensorData?.bombaAtiva,
    statusLuz: sensorData?.statusLuz,
  };
}

export default useWebSocket;

