import { useMemo } from 'react';
import type { OrderbookLevel } from '../types/orderbook';
import type { DepthLevel, SlippageEstimate } from '../lib/math';
import { computeDepth, estimateSlippage } from '../lib/math';

export function useLiquidityMetrics(
  bids: OrderbookLevel[],
  asks: OrderbookLevel[],
  midPrice: number
) {
  const depthLevels = useMemo<DepthLevel[]>(() => {
    if (bids.length === 0 || asks.length === 0 || midPrice === 0) {
      return [];
    }
    return computeDepth(bids, asks, midPrice);
  }, [bids, asks, midPrice]);

  const slippage = useMemo<SlippageEstimate[]>(() => {
    if (bids.length === 0 || asks.length === 0 || midPrice === 0) {
      return [];
    }
    return estimateSlippage(bids, asks, midPrice);
  }, [bids, asks, midPrice]);

  return {
    depthLevels,
    slippage,
  };
}

