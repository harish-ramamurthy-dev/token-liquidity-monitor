import { formatPercent, formatUsd } from '../../lib/math';

interface FundingRateCardProps {
  fundingRate?: number;
  markPrice?: number;
  openInterest?: number;
  volume24h?: number;
  isLoading: boolean;
}

export function FundingRateCard({
  fundingRate,
  markPrice,
  openInterest,
  volume24h,
  isLoading,
}: FundingRateCardProps) {
  const isPositive = (fundingRate || 0) >= 0;

  return (
    <div className="bg-dark-100 rounded-lg p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 min-h-[120px] md:min-h-[56px]">
      {isLoading ? (
        <>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-dark-50 rounded w-3/4" />
            <div className="h-6 bg-dark-50 rounded w-full" />
          </div>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-dark-50 rounded w-3/4" />
            <div className="h-6 bg-dark-50 rounded w-full" />
          </div>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-dark-50 rounded w-3/4" />
            <div className="h-6 bg-dark-50 rounded w-full" />
          </div>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-dark-50 rounded w-3/4" />
            <div className="h-6 bg-dark-50 rounded w-full" />
          </div>
        </>
      ) : (
        <>
        {/* Funding Rate */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Funding / 8h</div>
          <div className={`text-lg font-semibold font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {fundingRate ? formatPercent(fundingRate) : 'N/A'}
          </div>
        </div>

        {/* Mark Price */}
        <div>
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            Mark Price
            {markPrice && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
          </div>
          <div className="text-lg font-semibold font-mono text-white">
            ${markPrice?.toFixed(2) || 'N/A'}
          </div>
        </div>

        {/* Open Interest */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Open Interest</div>
          <div className="text-lg font-semibold font-mono text-white">
            {openInterest ? formatUsd(openInterest) : 'N/A'}
          </div>
        </div>

        {/* 24h Volume */}
        <div>
          <div className="text-xs text-gray-500 mb-1">24h Volume</div>
          <div className="text-lg font-semibold font-mono text-white">
            {volume24h ? formatUsd(volume24h) : 'N/A'}
          </div>
        </div>
        </>
      )}
      </div>
    </div>
  );
}

