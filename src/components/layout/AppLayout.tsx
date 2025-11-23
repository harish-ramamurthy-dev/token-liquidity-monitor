import type { ReactNode } from 'react';
import { Header } from './Header';
import { MarketSelector } from './MarketSelector';

interface AppLayoutProps {
  children: ReactNode;
  selectedMarket: string;
  onMarketChange: (marketId: string) => void;
}

export function AppLayout({ children, selectedMarket, onMarketChange }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-dark-300 flex flex-col">
      <Header />
      <MarketSelector selectedMarket={selectedMarket} onChange={onMarketChange} />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

