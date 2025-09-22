# 🚀 Crypto Dashboard

A modern, responsive cryptocurrency dashboard built with React and Tailwind CSS that provides real-time market data, highlights, and detailed coin information using the CoinGecko API.

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
- **Axios**: HTTP client for API requests

### **Architecture Patterns**
- **Service Layer**: Abstracted API service classes
- **Adapter Pattern**: Clean API response transformation
- **Factory Pattern**: Service instantiation
- **Cache Pattern**: In-memory caching with TTL

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

## 🔧 Design Patterns Used

### **Service Layer Pattern**
Clean separation between UI and business logic
```javascript
const coinGeckoService = createCoinGeckoService();
const coins = await coinGeckoService.getCoinsMarkets();
```

### **Adapter Pattern**
Transform API responses to clean domain models
```javascript
export const adaptCoinFromApi = (apiCoin) => ({
  id: apiCoin.id,
  currentPrice: apiCoin.current_price,
  // ... clean domain model
});
```

### **Factory Pattern**
Service creation with dependency injection
```javascript
export const createCoinGeckoService = () => {
  const httpClient = createHttpClient();
  const cache = createCacheService();
  // ...
};
```

### **Cache Pattern**
TTL-based caching with automatic cleanup
```javascript
const cachedData = cache.get(cacheKey);
if (cachedData) return cachedData;
cache.set(cacheKey, data, ttl);
```

## 🌐 API Integration

Uses CoinGecko API v3 with the following endpoints:
- `/coins/markets` - Market data with pagination
- `/search/trending` - Trending cryptocurrencies
- `/coins/{id}` - Detailed coin information

**Rate Limiting**: Implements caching and error handling for API limits

## 🎨 Styling & Responsiveness

Built with **Tailwind CSS** for:
- **Mobile-first**: Responsive design across all devices
- **Consistent Design**: Unified color scheme and spacing
- **Performance**: Optimized CSS bundle size
- **Maintainability**: Utility classes for rapid development

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

### **Netlify**
```bash
npm run build
# Upload build folder to Netlify
```

### **Manual Deployment**
```bash
npm run build
# Deploy contents of build/ folder to your hosting provider
```

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **CoinGecko** for providing comprehensive cryptocurrency API
- **Tailwind CSS** for the excellent utility-first framework
- **React Team** for the amazing library and documentation

---

**Built with ❤️ using React and CoinGecko API**

*Data provided by CoinGecko • Updated every minute*
