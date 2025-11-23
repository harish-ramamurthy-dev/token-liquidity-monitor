# Token Liquidity Monitor

A real-time cryptocurrency liquidity monitoring dashboard built with React, TypeScript, and TailwindCSS. Displays live orderbook data, candlestick charts, liquidity metrics, and slippage estimates for Hyperliquid perpetual markets.

## Features

- **Real-time Order Book**: Live L2 orderbook data via WebSocket
- **TradingView Charts**: Candlestick charts with volume using lightweight-charts
- **Liquidity Metrics**: Depth analysis at various BPS levels
- **Slippage Estimates**: Market order slippage for different trade sizes
- **Funding Rates**: Live funding rates and market statistics
- **Multi-Market Support**: BTC, ETH, SOL, and HYPE perpetual markets
- **Responsive Design**: Mobile-first UI matching Hyperliquid's design

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **TradingView Lightweight Charts** for candlestick visualization
- **Hyperliquid API** for WebSocket and REST data

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will start on `http://localhost:5173` by default.

## Deployment

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment

Every push to the `main` branch triggers an automatic deployment via GitHub Actions.

### Manual Setup

1. **Create GitHub Repository**
   - Create a new repository on GitHub
   - Repository name should match the base in `vite.config.ts` (currently `token-liquidity-monitor`)

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: GitHub Actions

3. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/token-liquidity-monitor.git
   git push -u origin main
   ```

4. The GitHub Actions workflow will automatically build and deploy your site.

Your site will be available at: `https://YOUR_USERNAME.github.io/token-liquidity-monitor/`

## Project Structure

```
src/
  components/
    layout/        # Header, MarketSelector, AppLayout
    orderbook/     # Orderbook components
    metrics/       # Liquidity metrics and slippage
    chart/         # TradingView candlestick chart
  hooks/
    useWebSocket.ts      # Generic WebSocket hook
    useOrderbook.ts      # Orderbook data hook
    useCandles.ts        # Candle data hook
    useFundingRate.ts    # Funding rate hook
    useLiquidityMetrics.ts  # Liquidity calculations
  lib/
    hyperliquidWs.ts     # WebSocket utilities
    hyperliquidInfo.ts   # HTTP API client
    math.ts              # Liquidity & slippage calculations
    markets.ts           # Market definitions
  types/
    hyperliquid.ts       # API type definitions
    orderbook.ts         # Orderbook types
    candles.ts           # Candle types
```

## API Documentation

- [Hyperliquid WebSocket API](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/websocket/subscriptions)
- [Hyperliquid Info Endpoint](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint/perpetuals)

## Features by Phase

### Phase 0 ✅
- Vite + React + TypeScript + TailwindCSS setup

### Phase 1 ✅
- Market selector (mobile dropdown + desktop tabs)
- Type definitions for Hyperliquid API

### Phase 2 ✅
- Generic WebSocket hook with reconnection logic

### Phase 3 ✅
- Real-time orderbook via l2Book subscription
- Orderbook UI with bid/ask visualization

### Phase 4 ✅
- Liquidity depth calculations at BPS levels
- Slippage estimation for market orders

### Phase 5 ✅
- Funding rate from info endpoint
- Market statistics display

### Phase 6 ✅
- TradingView Lightweight Charts integration
- Candlestick chart with volume histogram

## Performance Optimizations

- `React.memo` for orderbook rows to prevent unnecessary re-renders
- `useMemo` for expensive calculations (depth, slippage)
- Throttled orderbook updates
- Limited orderbook levels (top 50)
- Limited candle history (500 candles)

## License

MIT
