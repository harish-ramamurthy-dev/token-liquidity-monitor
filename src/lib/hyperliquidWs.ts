// Hyperliquid WebSocket constants and utilities
export const HYPERLIQUID_WS_URL = 'wss://api.hyperliquid.xyz/ws';

export const createSubscription = (type: string, params: Record<string, any> = {}) => ({
  method: 'subscribe',
  subscription: {
    type,
    ...params,
  },
});

export const createUnsubscription = (type: string, params: Record<string, any> = {}) => ({
  method: 'unsubscribe',
  subscription: {
    type,
    ...params,
  },
});

