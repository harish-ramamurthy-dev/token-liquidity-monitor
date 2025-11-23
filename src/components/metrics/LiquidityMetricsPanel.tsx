import { DepthHeatmap } from './DepthHeatmap';
import { SlippageTable } from './SlippageTable';
import type { DepthLevel, SlippageEstimate } from '../../lib/math';

interface LiquidityMetricsPanelProps {
  depthLevels: DepthLevel[];
  slippage: SlippageEstimate[];
}

export function LiquidityMetricsPanel({ depthLevels, slippage }: LiquidityMetricsPanelProps) {
  const hasData = depthLevels.length > 0 && slippage.length > 0;

  return (
    <div className="bg-dark-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Liquidity Metrics</h2>
        {!hasData && (
          <span className="text-xs text-gray-500">Waiting for orderbook data...</span>
        )}
      </div>
      
      {!hasData ? (
        <div className="text-gray-400 text-center py-8">
          <div className="text-sm mb-2">Loading liquidity data...</div>
          <div className="text-xs text-gray-500">Connect to orderbook to see depth & slippage metrics</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepthHeatmap depthLevels={depthLevels} />
          <SlippageTable slippage={slippage} />
        </div>
      )}
    </div>
  );
}

