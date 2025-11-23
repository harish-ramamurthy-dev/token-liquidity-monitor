// Hyperliquid Info Endpoint (HTTP)
const INFO_ENDPOINT = 'https://api.hyperliquid.xyz/info';

interface InfoRequest {
  type: string;
  [key: string]: any;
}

async function postInfo(payload: InfoRequest): Promise<any> {
  const response = await fetch(INFO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getMeta() {
  return postInfo({ type: 'meta' });
}

export async function getMetaAndAssetCtxs() {
  return postInfo({ type: 'metaAndAssetCtxs' });
}

export async function getFundingRate(coin: string) {
  const data = await getMetaAndAssetCtxs();
  
  if (!data || !data[0]) {
    console.error('Invalid response from metaAndAssetCtxs:', data);
    return null;
  }
  
  const meta = data[0];
  const assetCtxs = data[1];
  
  const coinIndex = meta.universe.findIndex((u: any) => u.name === coin);
  
  if (coinIndex === -1) {
    console.warn(`Coin ${coin} not found in universe`);
    return null;
  }
  
  const assetCtx = assetCtxs[coinIndex];
  
  // Open Interest is in base asset (e.g., BTC), need to convert to USD
  const openInterestCoins = parseFloat(assetCtx.openInterest);
  const markPrice = parseFloat(assetCtx.markPx);
  const openInterestUsd = openInterestCoins * markPrice;
  
  return {
    fundingRate: parseFloat(assetCtx.funding),
    markPrice: markPrice,
    openInterest: openInterestUsd,
    volume24h: parseFloat(assetCtx.dayNtlVlm),
  };
}

export async function getAllMids() {
  return postInfo({ type: 'allMids' });
}

export async function getCandleSnapshot(coin: string, interval: string, startTime: number, endTime: number) {
  return postInfo({
    type: 'candleSnapshot',
    req: {
      coin,
      interval,
      startTime,
      endTime,
    },
  });
}

