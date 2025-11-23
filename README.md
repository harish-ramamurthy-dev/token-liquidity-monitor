# Token Liquidity Monitor

A real-time cryptocurrency liquidity monitoring dashboard built with React, TypeScript, and TailwindCSS. Displays live orderbook data, candlestick charts, liquidity metrics, and slippage estimates for Hyperliquid perpetual markets.

## Features

- **Real-time Order Book**: Live L2 orderbook data via WebSocket
- **TradingView Charts**: Candlestick charts with volume using lightweight-charts
- **Liquidity Metrics**: Depth analysis at various BPS levels
- **Slippage Estimates**: Market order slippage for different trade sizes
- **Funding Rates**: Live funding rates and market statistics
- **Multi-Market Support**: BTC, ETH, SOL perpetual markets
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

The site will be available at: `https://harish-ramamurthy-dev.github.io/token-liquidity-monitor/`

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

## Hyperliquid API Documentation

- [Hyperliquid WebSocket API](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/websocket/subscriptions)
- [Hyperliquid Info Endpoint](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint/perpetuals)
