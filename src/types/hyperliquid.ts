// WebSocket Types from Hyperliquid API
export interface WsLevel {
  px: string;
  sz: string;
  n: number;
}

export interface WsBook {
  coin: string;
  levels: [Array<WsLevel>, Array<WsLevel>]; // [bids, asks]
  time: number;
}

export interface WsTrade {
  coin: string;
  side: string;
  px: string;
  sz: string;
  hash: string;
  time: number;
  tid: number;
  users: [string, string];
}

export interface Candle {
  t: number; // timestamp in milliseconds
  T: number; // close time
  s: string; // symbol
  i: string; // interval
  o: string; // open
  h: string; // high
  l: string; // low
  c: string; // close
  v: string; // volume
  n: number; // number of trades
}

export interface AllMids {
  mids: Record<string, string>;
}

export interface WsSubscription {
  method: 'subscribe' | 'unsubscribe';
  subscription: {
    type: string;
    coin?: string;
    interval?: string;
    user?: string;
  };
}

export interface WsMessage {
  channel: string;
  data: any;
}

// Info Endpoint Types
export interface AssetCtx {
  dayNtlVlm: string;
  funding: string;
  openInterest: string;
  prevDayPx: string;
  markPx: string;
  midPx?: string;
  oraclePx: string;
}

export interface Meta {
  universe: Array<{
    name: string;
    szDecimals: number;
    maxLeverage: number;
    onlyIsolated: boolean;
  }>;
}

export interface MetaAndAssetCtxs {
  meta: Meta;
  assetCtxs: AssetCtx[];
}

export interface FundingHistory {
  coin: string;
  fundingRate: string;
  premium: string;
  time: number;
}

