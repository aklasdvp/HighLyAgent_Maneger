import { useEffect, useRef, useCallback, useState } from 'react';
import { connectGateway, type GatewayHandle } from '../lib/api';

export interface WebSocketCallbacks {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: (code: number, reason: string) => void;
  onError?: (error: Event) => void;
}

/**
 * Hook for managing WebSocket connections to HighLyAgent gateway
 * @param clientId - Project/Client ID
 * @param apiKey - Project API key (optional if using token)
 * @param token - JWT access token (optional if using apiKey)
 * @param callbacks - Event handlers
 * @returns Object with send function and connection status
 */
export function useWebSocket(
  clientId: string,
  apiKey?: string,
  token?: string,
  callbacks?: WebSocketCallbacks
) {
  const wsRef = useRef<GatewayHandle | null>(null);
  const [connected, setConnected] = useState(false);
  
  const connect = useCallback(() => {
    // Close existing connection first
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    if (!clientId) return;
    
    wsRef.current = connectGateway(
      { clientId, apiKey, token },
      {
        onFrame: (frame) => {
          callbacks?.onMessage?.(frame);
        },
        onOpen: () => {
          setConnected(true);
          callbacks?.onOpen?.();
        },
        onClose: (code, reason) => {
          setConnected(false);
          callbacks?.onClose?.(code, reason);
        },
        onError: (error) => {
          setConnected(false);
          callbacks?.onError?.(error);
        },
      }
    );
  }, [clientId, apiKey, token, callbacks]);
  
  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);
  
  // Reconnect if clientId changes
  useEffect(() => {
    if (clientId) {
      connect();
    }
  }, [clientId]);
  
  const send = useCallback((frame: Record<string, unknown>) => {
    if (wsRef.current) {
      wsRef.current.send(frame);
    }
  }, []);
  
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setConnected(false);
    }
  }, []);
  
  return {
    send,
    connected,
    connect,
    disconnect,
  };
}
