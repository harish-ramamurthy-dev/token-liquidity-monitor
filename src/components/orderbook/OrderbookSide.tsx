import type { OrderbookLevel } from '../../types/orderbook';
import { OrderbookRow } from './OrderbookRow';

interface OrderbookSideProps {
  side: 'bid' | 'ask';
  levels: OrderbookLevel[];
  maxTotal: number;
  mobile?: boolean;
}

export function OrderbookSide({ side, levels, maxTotal, mobile = false }: OrderbookSideProps) {
  const displayLevels = side === 'bid' ? levels.slice(0, 20) : levels.slice(0, 20);

  return (
    <div className="flex flex-col">
      {displayLevels.map((level, index) => (
        <OrderbookRow
          key={`${level.price}-${index}`}
          price={level.price}
          size={level.size}
          total={level.total}
          side={side}
          maxTotal={maxTotal}
          mobile={mobile}
        />
      ))}
    </div>
  );
}

