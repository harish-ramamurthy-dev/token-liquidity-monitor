import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, CandlestickData, HistogramData } from 'lightweight-charts';
import type { CandleData, VolumeData } from '../../types/candles';
import { useWindowSize } from '../../hooks/useWindowSize';

interface CandleChartProps {
  candles: CandleData[];
  volumes: VolumeData[];
  isLoading: boolean;
  marketId: string;
}

export function CandleChart({ candles, volumes, isLoading, marketId }: CandleChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const { width } = useWindowSize();

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    try {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 450,
        layout: {
          background: { type: ColorType.Solid, color: '#151922' },
          textColor: '#9CA3AF',
        },
        grid: {
          vertLines: { color: '#1F2937' },
          horzLines: { color: '#1F2937' },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: '#374151',
        },
        timeScale: {
          borderColor: '#374151',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      // Check if methods exist (for debugging)
      if (typeof chart.addCandlestickSeries !== 'function') {
        console.error('addCandlestickSeries not found. Available methods:', Object.keys(chart));
        return;
      }

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#14b8a6',
        downColor: '#ef4444',
        borderUpColor: '#14b8a6',
        borderDownColor: '#ef4444',
        wickUpColor: '#14b8a6',
        wickDownColor: '#ef4444',
      });

      const volumeSeries = chart.addHistogramSeries({
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
      });

      chart.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      chartRef.current = chart;
      candleSeriesRef.current = candleSeries;
      volumeSeriesRef.current = volumeSeries;

      return () => {
        chart.remove();
      };
    } catch (error) {
      console.error('Error initializing chart:', error);
    }
  }, []);

  // Initialize chart data once
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current) return;
    if (candles.length === 0) return;

    // Set initial data
    const candleData: CandlestickData[] = candles.map((c) => ({
      time: c.time as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
    candleSeriesRef.current.setData(candleData);

    const volumeData: HistogramData[] = volumes.map((v) => ({
      time: v.time as any,
      value: v.value,
      color: v.color,
    }));
    volumeSeriesRef.current.setData(volumeData);
    
    console.log(`📊 Chart initialized with ${candles.length} candles`);
  }, [isLoading]); // Only run when loading completes

  // Update chart with latest candle in real-time
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current) return;
    if (candles.length === 0 || isLoading) return;

    const latestCandle = candles[candles.length - 1];
    const latestVolume = volumes[volumes.length - 1];

    if (latestCandle) {
      candleSeriesRef.current.update({
        time: latestCandle.time as any,
        open: latestCandle.open,
        high: latestCandle.high,
        low: latestCandle.low,
        close: latestCandle.close,
      });
    }

    if (latestVolume) {
      volumeSeriesRef.current.update({
        time: latestVolume.time as any,
        value: latestVolume.value,
        color: latestVolume.color,
      });
    }
  }, [candles, volumes, isLoading]);

  // Handle resize
  useEffect(() => {
    if (chartRef.current && chartContainerRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    }
  }, [width]);

  const latestCandle = candles[candles.length - 1];

  return (
    <div className="bg-dark-100 rounded-lg p-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white">{marketId}-USDC</h2>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        )}
        {!isLoading && (
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" title="Live updates" />
        )}
      </div>

      {/* OHLC Info Bar */}
      {latestCandle && !isLoading && (
        <div className="flex items-center gap-4 mb-3 text-xs font-mono">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">O</span>
            <span className="text-gray-300">{latestCandle.open.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">H</span>
            <span className="text-green-400">{latestCandle.high.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">L</span>
            <span className="text-red-400">{latestCandle.low.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">C</span>
            <span className="text-white font-semibold">{latestCandle.close.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}

