import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { CandleChart } from './components/chart/CandleChart';
import { Orderbook } from './components/orderbook/Orderbook';
import { LiquidityMetricsPanel } from './components/metrics/LiquidityMetricsPanel';
import { FundingRateCard } from './components/metrics/FundingRateCard';
import { useOrderbook } from './hooks/useOrderbook';
import { useCandles } from './hooks/useCandles';
import { useFundingRate } from './hooks/useFundingRate';
import { useLiquidityMetrics } from './hooks/useLiquidityMetrics';

function App() {
  const [selectedMarket, setSelectedMarket] = useState('BTC');
  const [candleInterval] = useState('1h');
  const [mobileTab, setMobileTab] = useState<'chart' | 'orderbook'>('chart');

  // Fetch data
  const orderbook = useOrderbook(selectedMarket);
  const candles = useCandles(selectedMarket, candleInterval);
  const fundingRate = useFundingRate(selectedMarket);
  const { depthLevels, slippage } = useLiquidityMetrics(
    orderbook.bids,
    orderbook.asks,
    orderbook.midPrice
  );

  return (
    <AppLayout selectedMarket={selectedMarket} onMarketChange={setSelectedMarket}>
      <div className="max-w-screen-2xl mx-auto p-4 pb-8 h-full">
        <div className="space-y-4 mb-8">
          {/* Funding Rate Card */}
          <FundingRateCard
            fundingRate={fundingRate.fundingRate}
            markPrice={orderbook.midPrice || fundingRate.markPrice}
            openInterest={fundingRate.openInterest}
            volume24h={fundingRate.volume24h}
            isLoading={fundingRate.isLoading}
          />

          {/* Mobile Tabs */}
          <div className="lg:hidden bg-dark-100 rounded-lg overflow-hidden">
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => setMobileTab('chart')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  mobileTab === 'chart'
                    ? 'text-white border-b-2 border-primary-500'
                    : 'text-gray-400'
                }`}
              >
                Chart
              </button>
              <button
                onClick={() => setMobileTab('orderbook')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  mobileTab === 'orderbook'
                    ? 'text-white border-b-2 border-primary-500'
                    : 'text-gray-400'
                }`}
              >
                Order Book
              </button>
            </div>

            {/* Mobile Tab Content */}
            <div className="p-0">
              {mobileTab === 'chart' && (
                <div className="space-y-4">
                  <CandleChart
                    candles={candles.candles}
                    volumes={candles.volumes}
                    isLoading={candles.isLoading}
                    marketId={selectedMarket}
                  />
                  <div className="px-4 pb-4">
                    <LiquidityMetricsPanel depthLevels={depthLevels} slippage={slippage} />
                  </div>
                </div>
              )}
              {mobileTab === 'orderbook' && (
                <Orderbook
                  bids={orderbook.bids}
                  asks={orderbook.asks}
                  spread={orderbook.spread}
                  midPrice={orderbook.midPrice}
                  isConnected={orderbook.isConnected}
                  marketId={selectedMarket}
                />
              )}
            </div>
          </div>

          {/* Desktop Grid: Chart + Orderbook */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart Section - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-4">
              <CandleChart
                candles={candles.candles}
                volumes={candles.volumes}
                isLoading={candles.isLoading}
                marketId={selectedMarket}
              />
              
              {/* Liquidity Metrics */}
              <LiquidityMetricsPanel depthLevels={depthLevels} slippage={slippage} />
            </div>

            {/* Orderbook Section - Takes 1 column on large screens */}
            <div className="lg:col-span-1">
              <div className="sticky top-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <Orderbook
                  bids={orderbook.bids}
                  asks={orderbook.asks}
                  spread={orderbook.spread}
                  midPrice={orderbook.midPrice}
                  isConnected={orderbook.isConnected}
                  marketId={selectedMarket}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default App;
