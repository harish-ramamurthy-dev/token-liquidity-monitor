import { useState, useEffect } from 'react';
import { getFundingRate } from '../lib/hyperliquidInfo';

interface FundingRateData {
  fundingRate: number;
  markPrice: number;
  openInterest: number;
  volume24h: number;
}

const REFRESH_INTERVAL = 30000; // 30 seconds

export function useFundingRate(marketId: string) {
  const [data, setData] = useState<FundingRateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Reset state immediately when market changes
    console.log(`💰 Switching funding rate to ${marketId}`);
    setData(null);
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getFundingRate(marketId);
        
        if (isMounted && result) {
          setData(result);
          setError(null);
          console.log(`💰 Loaded funding rate for ${marketId}:`, result.fundingRate);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          console.error('Failed to fetch funding rate:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [marketId]);

  return {
    ...data,
    isLoading,
    error,
  };
}

