import { OrderbookSide } from './OrderbookSide';
import type { OrderbookLevel } from '../../types/orderbook';

interface OrderbookProps {
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  spread: number;
  midPrice: number;
  isConnected: boolean;
  marketId?: string;
}

export function Orderbook({ bids, asks, spread, midPrice, isConnected, marketId }: OrderbookProps) {
  const maxBidTotal = bids[bids.length - 1]?.total || 1;
  const maxAskTotal = asks[asks.length - 1]?.total || 1;
  const maxTotal = Math.max(maxBidTotal, maxAskTotal);

  const spreadBps = midPrice > 0 ? (spread / midPrice) * 10000 : 0;

  return (
    <div className="bg-dark-100 rounded-lg p-4 flex flex-col lg:h-[1038px] w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white hidden lg:block">Order Book</h2>
          {/* Grouping dropdown for mobile */}
          <div className="lg:hidden">
            <select className="bg-dark-50 text-white text-sm px-2 py-1 rounded border border-gray-700">
              <option value="1">1</option>
              <option value="0.1">0.1</option>
              <option value="0.01">0.01</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {marketId && (
            <span className="text-xs text-gray-400 font-mono lg:hidden">{marketId}</span>
          )}
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </div>

      {/* Desktop Column headers */}
      <div className="hidden lg:flex justify-between text-xs text-gray-500 font-mono px-2 mb-2">
        <span>Price</span>
        <span>Size</span>
        <span>Total</span>
      </div>

      {/* Mobile Side-by-Side Layout */}
      <div className="lg:hidden">
        {/* Column headers */}
        <div className="grid grid-cols-2 text-xs text-gray-500 font-mono mb-2">
          <div className="flex justify-between px-2">
            <span>Total ({marketId || 'BTC'})</span>
            <span>Price</span>
          </div>
          <div className="flex justify-between px-2">
            <span>Price</span>
            <span className="text-right">Total ({marketId || 'BTC'})</span>
          </div>
        </div>

        {/* Bids and Asks side by side */}
        <div className="grid grid-cols-2 gap-1">
          <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
            <OrderbookSide side="bid" levels={bids.slice(0, 15)} maxTotal={maxTotal} mobile={true} />
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
            <OrderbookSide side="ask" levels={asks.slice(0, 15)} maxTotal={maxTotal} mobile={true} />
          </div>
        </div>

        {/* Spread info */}
        <div className="mt-2 pt-2 border-t border-gray-800 text-center">
          <div className="text-xs text-gray-500">
            Spread: {spreadBps.toFixed(2)} bps ({spread.toFixed(2)})
          </div>
        </div>
      </div>

      {/* Desktop Stacked Layout */}
      <div className="hidden lg:flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Asks (reversed to show best ask at bottom) */}
        <div className="flex-1 flex flex-col-reverse min-h-0 overflow-hidden">
          <OrderbookSide side="ask" levels={asks} maxTotal={maxTotal} />
        </div>

        {/* Spread */}
        <div className="my-2 py-2 border-y border-gray-800 shrink-0">
          <div className="flex justify-between items-center text-sm px-2">
            <div className="text-gray-400">
              <span className="font-mono text-primary-400 font-semibold">
                {midPrice.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Spread: {spread.toFixed(2)} ({spreadBps.toFixed(2)} bps)
            </div>
          </div>
        </div>

        {/* Bids */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <OrderbookSide side="bid" levels={bids} maxTotal={maxTotal} />
        </div>
      </div>
    </div>
  );
}

