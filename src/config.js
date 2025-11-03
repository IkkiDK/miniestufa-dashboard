/**
 * Configurações da aplicação
 * 
 * Para desenvolvimento local:
 * - Use: ws://localhost:8080/ws
 * 
 * Para produção:
 * - Configure VITE_WS_URL no painel do serviço de hospedagem
 * - Exemplo: wss://seu-backend.onrender.com/ws
 */

const config = {
  // URL do WebSocket do backend
  // Em produção, esta variável deve ser configurada nas variáveis de ambiente da hospedagem
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws',
  
  // Configurações de reconexão
  reconnect: {
    enabled: true,
    interval: 5000, // ms
  }
};

export default config;

