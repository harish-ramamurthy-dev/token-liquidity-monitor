import { MARKETS } from '../../lib/markets';
import { useState } from 'react';

interface MarketSelectorProps {
  selectedMarket: string;
  onChange: (marketId: string) => void;
}

export function MarketSelector({ selectedMarket, onChange }: MarketSelectorProps) {
  const currentMarket = MARKETS.find(m => m.id === selectedMarket);
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-dark-100 border-b border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        {/* Mobile: Custom dropdown with icons */}
        <div className="block md:hidden">
          <div className="relative">
            {/* Dropdown Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-dark-50 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {currentMarket?.iconUrl ? (
                  <img 
                    src={currentMarket.iconUrl} 
                    alt={currentMarket.id} 
                    className="w-6 h-6"
                  />
                ) : (
                  <span className="text-lg">{currentMarket?.icon}</span>
                )}
                <span>{currentMarket?.label}</span>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-50 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
                  {MARKETS.map((market) => (
                    <button
                      key={market.id}
                      onClick={() => {
                        onChange(market.id);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                        selectedMarket === market.id
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {market.iconUrl ? (
                        <img 
                          src={market.iconUrl} 
                          alt={market.id} 
                          className="w-6 h-6"
                        />
                      ) : (
                        <span className="text-lg">{market.icon}</span>
                      )}
                      <span className="font-medium">{market.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop: Tab bar with icons */}
        <div className="hidden md:flex gap-2">
          {MARKETS.map((market) => (
            <button
              key={market.id}
              onClick={() => onChange(market.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer
                ${
                  selectedMarket === market.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-50 text-gray-400 hover:bg-gray-700 hover:text-white hover:scale-105'
                }
              `}
            >
              {market.iconUrl ? (
                <img 
                  src={market.iconUrl} 
                  alt={market.id} 
                  className="w-5 h-5"
                />
              ) : (
                <span className="text-lg">{market.icon}</span>
              )}
              <span>{market.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

