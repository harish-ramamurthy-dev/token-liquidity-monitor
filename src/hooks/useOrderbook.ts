import { useState, useEffect, useCallback } from 'react';
import { useSharedWebSocket } from '../contexts/WebSocketContext';
import { createSubscription, createUnsubscription } from '../lib/hyperliquidWs';
import type { WsBook, WsLevel } from '../types/hyperliquid';
import type { OrderbookData, OrderbookLevel } from '../types/orderbook';

const MAX_LEVELS = 50;

function parseLevel(level: WsLevel): OrderbookLevel {
  return {
    price: parseFloat(level.px),
    size: parseFloat(level.sz),
    total: 0,
  };
}

function processSide(levels: WsLevel[]): OrderbookLevel[] {
  const parsed = levels.slice(0, MAX_LEVELS).map(parseLevel);
  
  // Calculate cumulative totals
  let cumulative = 0;
  return parsed.map((level) => {
    cumulative += level.size;
    return { ...level, total: cumulative };
  });
}

export function useOrderbook(marketId: string) {
  const [orderbookData, setOrderbookData] = useState<OrderbookData>({
    bids: [],
    asks: [],
    spread: 0,
    midPrice: 0,
    lastUpdateTime: 0,
  });

  // Reset state when market changes
  useEffect(() => {
    setOrderbookData({
      bids: [],
      asks: [],
      spread: 0,
      midPrice: 0,
      lastUpdateTime: 0,
    });
  }, [marketId]);

  const { connectionStatus, sendJsonMessage, subscribe } = useSharedWebSocket();

  const handleMessage = useCallback((message: any) => {
    if (message.channel === 'l2Book' && message.data?.coin === marketId) {
      const book: WsBook = message.data;
      const [bidLevels, askLevels] = book.levels;

      const bids = processSide(bidLevels);
      const asks = processSide(askLevels);

      const bestBid = bids[0]?.price || 0;
      const bestAsk = asks[0]?.price || 0;
      const spread = bestAsk - bestBid;
      const midPrice = (bestBid + bestAsk) / 2;

      setOrderbookData({
        bids,
        asks,
        spread,
        midPrice,
        lastUpdateTime: book.time,
      });
    }
  }, [marketId]);

  useEffect(() => {
    const unsubscribe = subscribe(handleMessage);
    return unsubscribe;
  }, [subscribe, handleMessage]);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      sendJsonMessage(createSubscription('l2Book', { coin: marketId }));

      return () => {
        sendJsonMessage(createUnsubscription('l2Book', { coin: marketId }));
      };
    }
  }, [marketId, connectionStatus, sendJsonMessage]);

  return {
    ...orderbookData,
    isConnected: connectionStatus === 'connected',
  };
}

