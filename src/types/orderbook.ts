export interface OrderbookLevel {
  price: number;
  size: number;
  total: number;
}

export interface OrderbookData {
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  spread: number;
  midPrice: number;
  lastUpdateTime: number;
}

