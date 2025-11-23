import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { HYPERLIQUID_WS_URL } from '../lib/hyperliquidWs';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
type MessageHandler = (message: any) => void;

interface WebSocketContextType {
  connectionStatus: ConnectionStatus;
  sendJsonMessage: (payload: any) => void;
  subscribe: (handler: MessageHandler) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Set<MessageHandler>>(new Set());
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reconnectCountRef = useRef(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  const connect = useCallback(() => {
    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      setConnectionStatus('connecting');
      console.log('Attempting to connect to Hyperliquid WebSocket...');
      const ws = new WebSocket(HYPERLIQUID_WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connected successfully to Hyperliquid');
        setConnectionStatus('connected');
        reconnectCountRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Broadcast to all subscribers
          handlersRef.current.forEach((handler) => {
            try {
              handler(data);
            } catch (error) {
              console.error('Error in message handler:', error);
            }
          });
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed', { code: event.code, reason: event.reason, wasClean: event.wasClean });
        setConnectionStatus('disconnected');

        // Attempt to reconnect
        if (reconnectCountRef.current < 5) {
          reconnectCountRef.current++;
          console.log(`Reconnecting... (${reconnectCountRef.current}/5)`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        } else {
          console.error('Maximum reconnection attempts reached');
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error occurred:', {
          type: event.type,
          target: event.target,
          readyState: wsRef.current?.readyState,
          url: HYPERLIQUID_WS_URL
        });
        setConnectionStatus('error');
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionStatus('error');
    }
  }, []);

  const sendJsonMessage = useCallback((payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const subscribe = useCallback((handler: MessageHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  useEffect(() => {
    // Only connect if not already connected or connecting
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      connect();
    }

    // Cleanup on page unload (not on component unmount)
    const handlePageUnload = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };

    window.addEventListener('beforeunload', handlePageUnload);

    return () => {
      window.removeEventListener('beforeunload', handlePageUnload);
      // Don't close the WebSocket on unmount - let it persist
      // This prevents reconnection loops in React StrictMode (dev) and during hot reloads
    };
  }, [connect]);

  return (
    <WebSocketContext.Provider value={{ connectionStatus, sendJsonMessage, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useSharedWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useSharedWebSocket must be used within WebSocketProvider');
  }
  return context;
}

