import type { OrderbookLevel } from '../types/orderbook';

export const BPS_LEVELS = [10, 25, 50, 100, 200] as const;
export const TRADE_SIZES = [1000, 10000, 100000] as const;

export interface DepthLevel {
  bps: number;
  bidDepthUsd: number;
  askDepthUsd: number;
}

export interface SlippageEstimate {
  notional: number;
  buySlippageBps: number;
  sellSlippageBps: number;
}

/**
 * Compute depth at various BPS levels from mid price
 */
export function computeDepth(
  bids: OrderbookLevel[],
  asks: OrderbookLevel[],
  midPrice: number
): DepthLevel[] {
  return BPS_LEVELS.map((bps) => {
    // For bids: from midPrice * (1 - bps/10000) to midPrice
    const bidLowerBound = midPrice * (1 - bps / 10000);
    const bidDepthUsd = bids
      .filter((level) => level.price >= bidLowerBound && level.price <= midPrice)
      .reduce((sum, level) => sum + level.price * level.size, 0);

    // For asks: from midPrice to midPrice * (1 + bps/10000)
    const askUpperBound = midPrice * (1 + bps / 10000);
    const askDepthUsd = asks
      .filter((level) => level.price <= askUpperBound && level.price >= midPrice)
      .reduce((sum, level) => sum + level.price * level.size, 0);

    return {
      bps,
      bidDepthUsd,
      askDepthUsd,
    };
  });
}

/**
 * Estimate slippage for market orders of various sizes
 */
export function estimateSlippage(
  bids: OrderbookLevel[],
  asks: OrderbookLevel[],
  midPrice: number
): SlippageEstimate[] {
  return TRADE_SIZES.map((notional) => {
    // Buy order (consume asks)
    let remainingUsd = notional;
    let totalCost = 0;
    let totalSize = 0;

    for (const ask of asks) {
      if (remainingUsd <= 0) break;
      
      const levelValue = ask.price * ask.size;
      const consumed = Math.min(remainingUsd, levelValue);
      const size = consumed / ask.price;
      
      totalCost += consumed;
      totalSize += size;
      remainingUsd -= consumed;
    }

    const avgBuyPrice = totalSize > 0 ? totalCost / totalSize : midPrice;
    const buySlippageBps = ((avgBuyPrice - midPrice) / midPrice) * 10000;

    // Sell order (consume bids)
    remainingUsd = notional;
    totalCost = 0;
    totalSize = 0;

    for (const bid of bids) {
      if (remainingUsd <= 0) break;
      
      const levelValue = bid.price * bid.size;
      const consumed = Math.min(remainingUsd, levelValue);
      const size = consumed / bid.price;
      
      totalCost += consumed;
      totalSize += size;
      remainingUsd -= consumed;
    }

    const avgSellPrice = totalSize > 0 ? totalCost / totalSize : midPrice;
    const sellSlippageBps = ((midPrice - avgSellPrice) / midPrice) * 10000;

    return {
      notional,
      buySlippageBps: Math.max(0, buySlippageBps),
      sellSlippageBps: Math.max(0, sellSlippageBps),
    };
  });
}

/**
 * Format number as USD
 */
export function formatUsd(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(3)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

/**
 * Format BPS with sign
 */
export function formatBps(bps: number): string {
  return `${bps >= 0 ? '+' : ''}${bps.toFixed(2)}`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(4)}%`;
}

