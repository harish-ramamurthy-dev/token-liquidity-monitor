import { memo } from 'react';

interface OrderbookRowProps {
  price: number;
  size: number;
  total: number;
  side: 'bid' | 'ask';
  maxTotal: number;
  mobile?: boolean;
}

export const OrderbookRow = memo(function OrderbookRow({
  price,
  size,
  total,
  side,
  maxTotal,
  mobile = false,
}: OrderbookRowProps) {
  const percentage = (total / maxTotal) * 100;
  const bgColor = side === 'bid' ? 'bg-green-500/10' : 'bg-red-500/10';

  // Mobile layout: 2 columns only (Total and Price)
  if (mobile) {
    return (
      <div className="relative h-6 flex items-center text-xs font-mono">
        {/* Background bar */}
        <div
          className={`absolute inset-y-0 ${side === 'bid' ? 'right-0' : 'left-0'} ${bgColor}`}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Content */}
        <div className="relative z-10 w-full flex justify-between px-2">
          {side === 'bid' ? (
            <>
              <span className="text-gray-400">{total.toFixed(5)}</span>
              <span className="text-green-400">{price.toFixed(0)}</span>
            </>
          ) : (
            <>
              <span className="text-red-400">{price.toFixed(0)}</span>
              <span className="text-gray-400">{total.toFixed(5)}</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout: 3 columns (Price, Size, Total)
  return (
    <div className="relative h-6 flex items-center text-xs font-mono">
      {/* Background bar */}
      <div
        className={`absolute inset-y-0 right-0 ${bgColor}`}
        style={{ width: `${percentage}%` }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full flex justify-between px-2">
        <span className={side === 'bid' ? 'text-green-400' : 'text-red-400'}>
          {price.toFixed(2)}
        </span>
        <span className="text-gray-400">{size.toFixed(4)}</span>
        <span className="text-gray-500">{total.toFixed(2)}</span>
      </div>
    </div>
  );
});

