# 🚀 Crypto Dashboard

A modern, responsive cryptocurrency dashboard built with React and Tailwind CSS that provides real-time market data, highlights, and detailed coin information using the CoinGecko API.

**#Live URL**
([url](https://medibuddy-xgxa.onrender.com))

## ✨ Features

### 🎯 Core Features
- **All Coins View**: Comprehensive table with live cryptocurrency data
- **Market Highlights**: Top gainers, losers, highest volume, and trending coins
- **Real-time Data**: Live pricing and market statistics
- **Search & Filter**: Find cryptocurrencies by name or symbol
- **Sorting**: Sort by price, market cap, volume, and 24h change
- **Pagination**: Navigate through thousands of cryptocurrencies
- **Coin Details**: Detailed modal with comprehensive coin information

### 🎨 UI/UX Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: Graceful error handling with retry mechanisms
- **Accessibility**: ARIA labels and keyboard navigation support
- **Modern Design**: Clean, professional interface using Tailwind CSS

### ⚡ Performance Features
- **Caching**: In-memory caching to reduce API calls
- **Debouncing**: Search input debouncing for better performance
- **Error Boundaries**: Robust error handling and recovery
- **Optimized Rendering**: Efficient React patterns and components

## 🏗️ Tech Stack & Architecture

### **Frontend**
- **React 18**: Modern functional components with hooks
- **JavaScript ES6+**: Modern JavaScript features
- **Tailwind CSS**: Utility-first CSS framework

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation & Setup

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd crypto-dashboard
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Optional: Add your CoinGecko API key to .env
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

### Available Scripts

#### `npm start`
Runs the app in development mode on [http://localhost:3000](http://localhost:3000)

#### `npm run build`
Builds the app for production to the `build` folder

#### `npm test`
Launches the test runner in interactive watch mode

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── CoinTable/       # Main coins table component
│   ├── HighlightsSection/ # Market highlights component
│   └── CoinDetailModal/ # Coin details modal
├── services/            # API and business logic
│   ├── httpClient.js    # HTTP client with interceptors
│   ├── cacheService.js  # Caching service
│   └── coinGeckoService.js # CoinGecko API integration
├── utils/              # Utility functions
│   └── formatters.js   # Data formatting utilities
├── constants/          # Application constants
│   └── api.js         # API configuration
└── App.js             # Main application component
```

## 🌐 API Integration

Uses CoinGecko API v3 with the following endpoints:
- `/coins/markets` - Market data with pagination
- `/search/trending` - Trending cryptocurrencies
- `/coins/{id}` - Detailed coin information

**Rate Limiting**: Implements caching and error handling for API limits




## 🔮 Future Enhancements

- [ ] Price alerts and notifications
- [ ] Portfolio tracking functionality
- [ ] Historical price charts
- [ ] Dark/light theme toggle
- [ ] Real-time WebSocket updates
- [ ] Progressive Web App features

## 🐛 Troubleshooting

### Common Issues

**API Rate Limiting**: Get a free CoinGecko API key and add it to `.env`

**Build Fails**: Ensure Node.js version is 14+ and all dependencies are installed

**Styling Issues**: Verify Tailwind CSS is properly configured in `tailwind.config.js`



