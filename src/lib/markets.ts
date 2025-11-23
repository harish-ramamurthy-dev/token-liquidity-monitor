export interface Market {
  id: string;
  label: string;
  icon: string;
  iconUrl?: string;
}

export const MARKETS: Market[] = [
  { id: 'BTC', label: 'BTC-USDC', icon: '₿', iconUrl: 'https://app.hyperliquid.xyz/coins/BTC.svg' },
  { id: 'ETH', label: 'ETH-USDC', icon: 'Ξ', iconUrl: 'https://app.hyperliquid.xyz/coins/ETH.svg' },
  { id: 'SOL', label: 'SOL-USDC', icon: '◎', iconUrl: 'https://app.hyperliquid.xyz/coins/SOL.svg' },
] as const;

export const CANDLE_INTERVALS = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '1d', label: '1D' },
] as const;

export type CandleInterval = typeof CANDLE_INTERVALS[number]['value'];

