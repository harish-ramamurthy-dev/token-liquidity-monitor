import { useState, useEffect, useCallback, useRef } from 'react';
import { useSharedWebSocket } from '../contexts/WebSocketContext';
import { createSubscription, createUnsubscription } from '../lib/hyperliquidWs';
import type { Candle } from '../types/hyperliquid';
import type { CandleData, VolumeData } from '../types/candles';
import { getCandleSnapshot } from '../lib/hyperliquidInfo';

const MAX_CANDLES = 500;

function parseCandle(candle: Candle): CandleData {
  return {
    time: candle.t / 1000,
    open: parseFloat(candle.o),
    high: parseFloat(candle.h),
    low: parseFloat(candle.l),
    close: parseFloat(candle.c),
    volume: parseFloat(candle.v),
  };
}

function candleToVolume(candle: CandleData): VolumeData {
  return {
    time: candle.time,
    value: candle.volume || 0,
    color: candle.close >= candle.open ? '#14b8a6' : '#ef4444',
  };
}

export function useCandles(marketId: string, interval: string = '1h') {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [volumes, setVolumes] = useState<VolumeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadRef = useRef(false);

  const { connectionStatus, sendJsonMessage, subscribe } = useSharedWebSocket();

  const handleMessage = useCallback((message: any) => {
    if (message.channel === 'candle' && message.data) {
      const candleArray = Array.isArray(message.data) ? message.data : [message.data];
      
      candleArray.forEach((rawCandle: Candle) => {
        if (rawCandle.s === marketId && rawCandle.i === interval) {
          const newCandle = parseCandle(rawCandle);
          
          setCandles((prev) => {
            const existing = prev.findIndex((c) => c.time === newCandle.time);
            if (existing !== -1) {
              // Update existing candle (current candle still forming)
              const updated = [...prev];
              updated[existing] = newCandle;
              return updated;
            } else {
              // Add new candle (new period started)
              const updated = [...prev, newCandle].slice(-MAX_CANDLES);
              return updated.sort((a, b) => a.time - b.time);
            }
          });

          setVolumes((prev) => {
            const newVolume = candleToVolume(newCandle);
            const existing = prev.findIndex((v) => v.time === newVolume.time);
            if (existing !== -1) {
              const updated = [...prev];
              updated[existing] = newVolume;
              return updated;
            } else {
              const updated = [...prev, newVolume].slice(-MAX_CANDLES);
              return updated.sort((a, b) => a.time - b.time);
            }
          });
        }
      });
    }
  }, [marketId, interval]);

  useEffect(() => {
    const unsubscribe = subscribe(handleMessage);
    return unsubscribe;
  }, [subscribe, handleMessage]);

  // Load historical candles
  useEffect(() => {
    // Reset state immediately when market changes
    setCandles([]);
    setVolumes([]);
    setIsLoading(true);
    initialLoadRef.current = false;
    
    const endTime = Date.now();
    // Load 30 days of data for better historical view
    const startTime = endTime - 30 * 24 * 60 * 60 * 1000;

    getCandleSnapshot(marketId, interval, startTime, endTime)
      .then((data) => {
        if (data && Array.isArray(data)) {
          const parsedCandles = data.map(parseCandle);
          setCandles(parsedCandles);
          setVolumes(parsedCandles.map(candleToVolume));
        }
      })
      .catch((error) => {
        console.error('Failed to load historical candles:', error);
      })
      .finally(() => {
        setIsLoading(false);
        initialLoadRef.current = true;
      });
  }, [marketId, interval]);

  // Subscribe to live candle updates
  useEffect(() => {
    if (connectionStatus === 'connected') {
      sendJsonMessage(createSubscription('candle', { coin: marketId, interval }));

      return () => {
        sendJsonMessage(createUnsubscription('candle', { coin: marketId, interval }));
      };
    }
  }, [marketId, interval, connectionStatus, sendJsonMessage]);

  return {
    candles,
    volumes,
    isLoading,
    isConnected: connectionStatus === 'connected',
  };
}

