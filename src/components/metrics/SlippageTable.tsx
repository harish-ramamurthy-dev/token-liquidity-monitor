import type { SlippageEstimate } from '../../lib/math';
import { formatUsd, formatBps } from '../../lib/math';

interface SlippageTableProps {
  slippage: SlippageEstimate[];
}

export function SlippageTable({ slippage }: SlippageTableProps) {
  if (slippage.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Slippage Estimates</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th className="text-left py-2">Trade Size</th>
              <th className="text-right py-2">Buy Slippage</th>
              <th className="text-right py-2">Sell Slippage</th>
            </tr>
          </thead>
          <tbody>
            {slippage.map((estimate) => (
              <tr key={estimate.notional} className="border-b border-gray-800/50">
                <td className="py-2 text-white font-mono">
                  {formatUsd(estimate.notional)}
                </td>
                <td className="text-right py-2 text-red-400 font-mono">
                  {formatBps(estimate.buySlippageBps)} bps
                </td>
                <td className="text-right py-2 text-green-400 font-mono">
                  {formatBps(estimate.sellSlippageBps)} bps
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

