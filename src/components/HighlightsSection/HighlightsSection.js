import React, { useState, useEffect } from 'react';
import { createCoinGeckoService } from '../../services/coinGeckoService';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const coinGeckoService = createCoinGeckoService();

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, itemIndex) => (
            <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col justify-center items-center p-12 text-center">
    <div className="text-red-600 text-xl font-semibold mb-2">Failed to Load Highlights</div>
    <div className="text-gray-600 mb-6">Unable to fetch cryptocurrency highlights. Please try again.</div>
    <button
      onClick={onRetry}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
    >
      Try Again
    </button>
  </div>
);

const HighlightCard = ({ title, icon, iconBgColor, coins, onCoinClick, type }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
    <div className="flex items-center space-x-3 mb-4">
      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-sm ${iconBgColor}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="space-y-2">
      {coins.length === 0 ? (
        <div className="flex justify-center items-center p-8 text-gray-500 text-sm">
          No data available
        </div>
      ) : (
        coins.map((coin, index) => (
          <CoinItem
            key={coin.id || `${type}-${index}`}
            coin={coin}
            onClick={onCoinClick}
            type={type}
            rank={index + 1}
          />
        ))
      )}
    </div>
  </div>
);

const CoinItem = ({ coin, onClick, type, rank }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(coin);
    }
  };

  // Handle trending coins which have different structure
  if (type === 'trending') {
    return (
      <div
        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-150"
        onClick={handleClick}
      >
        <div className="flex items-center space-x-3 flex-1">
          <div className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded min-w-6 text-center">
            {rank}
          </div>
          <img
            src={coin.thumb || coin.small || coin.large}
            alt={coin.name}
            className="w-7 h-7 rounded-full flex-shrink-0"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTQiIGN5PSIxNCIgcj0iMTQiIGZpbGw9IiNFNUU3RUIiLz4KPHRleHQgeD0iMTQiIHk9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTc5Nzk3IiBmb250LXNpemU9IjEwIj4/PC90ZXh0Pgo8L3N2Zz4K';
            }}
          />
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{coin.name}</h4>
            <span className="text-gray-500 text-xs uppercase">{coin.symbol}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-600">Rank #{coin.marketCapRank || 'N/A'}</div>
        </div>
      </div>
    );
  }

  // Handle regular coins
  return (
    <div
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-150"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <img
          src={coin.image}
          alt={coin.name}
          className="w-7 h-7 rounded-full flex-shrink-0"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTQiIGN5PSIxNCIgcj0iMTQiIGZpbGw9IiNFNUU3RUIiLz4KPHRleHQgeD0iMTQiIHk9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTc5Nzk3IiBmb250LXNpemU9IjEwIj4/PC90ZXh0Pgo8L3N2Zz4K';
          }}
        />
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">{coin.name}</h4>
          <span className="text-gray-500 text-xs uppercase">{coin.symbol}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-gray-900 text-sm">
          {formatCurrency(coin.currentPrice)}
        </div>
        <div className={`text-xs font-semibold ${
          coin.priceChangePercentage24h >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatPercentage(coin.priceChangePercentage24h)}
        </div>
      </div>
    </div>
  );
};

const HighlightsSection = ({ onCoinClick }) => {
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [highestVolume, setHighestVolume] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      setError(null);

      const [gainersData, losersData, volumeData, trendingData] = await Promise.allSettled([
        coinGeckoService.getTopGainers(5),
        coinGeckoService.getTopLosers(5),
        coinGeckoService.getHighestVolume(5),
        coinGeckoService.getTrendingCoins()
      ]);

      console.log(gainersData);

      // Handle results with graceful fallbacks
      setTopGainers(gainersData.status === 'fulfilled' ? gainersData.value : []);
      setTopLosers(losersData.status === 'fulfilled' ? losersData.value : []);
      setHighestVolume(volumeData.status === 'fulfilled' ? volumeData.value : []);
      setTrending(trendingData.status === 'fulfilled' ? trendingData.value.slice(0, 5) : []);

      // If all requests failed, show error
      if ([gainersData, losersData, volumeData, trendingData].every(result => result.status === 'rejected')) {
        throw new Error('All highlight requests failed');
      }

    } catch (err) {
      console.error('Error fetching highlights:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  const handleRetry = () => {
    fetchHighlights();
  };

  const handleCoinClick = (coin) => {
    if (onCoinClick) {
      onCoinClick(coin);
    }
  };

  if (loading) {
    return (
      <div className="my-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Market Highlights</h2>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Market Highlights</h2>
        <ErrorState onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Market Highlights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HighlightCard
          title="Top Gainers (24h)"
          icon="📈"
          iconBgColor="bg-green-100 text-green-800"
          coins={topGainers}
          onCoinClick={handleCoinClick}
          type="gainers"
        />

        <HighlightCard
          title="Top Losers (24h)"
          icon="📉"
          iconBgColor="bg-red-100 text-red-800"
          coins={topLosers}
          onCoinClick={handleCoinClick}
          type="losers"
        />

        <HighlightCard
          title="Highest Volume"
          icon="💹"
          iconBgColor="bg-blue-100 text-blue-800"
          coins={highestVolume}
          onCoinClick={handleCoinClick}
          type="volume"
        />

        <HighlightCard
          title="Trending"
          icon="🔥"
          iconBgColor="bg-yellow-100 text-yellow-800"
          coins={trending}
          onCoinClick={handleCoinClick}
          type="trending"
        />
      </div>
    </div>
  );
};

export default HighlightsSection;