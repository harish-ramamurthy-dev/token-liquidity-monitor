import type { DepthLevel } from '../../lib/math';
import { formatUsd } from '../../lib/math';

interface DepthHeatmapProps {
  depthLevels: DepthLevel[];
}

export function DepthHeatmap({ depthLevels }: DepthHeatmapProps) {
  if (depthLevels.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        No data available
      </div>
    );
  }

  const maxDepth = Math.max(
    ...depthLevels.flatMap((d) => [d.bidDepthUsd, d.askDepthUsd])
  );

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Depth by BPS Level</h3>
      
      <div className="space-y-3">
        {depthLevels.map((level) => {
          const bidWidth = (level.bidDepthUsd / maxDepth) * 100;
          const askWidth = (level.askDepthUsd / maxDepth) * 100;
          
          return (
            <div key={level.bps}>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>±{level.bps} bps</span>
              </div>
              
              {/* Bid depth bar */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-green-400 w-12">Bid</span>
                <div className="flex-1 h-5 bg-dark-50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500/50 to-green-500/30"
                    style={{ width: `${bidWidth}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-20 text-right">
                  {formatUsd(level.bidDepthUsd)}
                </span>
              </div>

              {/* Ask depth bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400 w-12">Ask</span>
                <div className="flex-1 h-5 bg-dark-50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500/50 to-red-500/30"
                    style={{ width: `${askWidth}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-20 text-right">
                  {formatUsd(level.askDepthUsd)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

