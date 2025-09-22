import React, { useState, useEffect, useMemo } from 'react';
import { createCoinGeckoService } from '../../services/coinGeckoService';
import { formatCurrency, formatPercentage, formatMarketCap, debounce } from '../../utils/formatters';

const coinGeckoService = createCoinGeckoService();

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-16">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading cryptocurrency data...</span>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col justify-center items-center p-16 text-center">
    <div className="text-red-600 text-xl font-semibold mb-2">{error.title}</div>
    <div className="text-gray-600 mb-6">{error.message}</div>
    <button
      onClick={onRetry}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
    >
      Try Again
    </button>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col justify-center items-center p-16 text-center">
    <div className="text-gray-900 text-xl font-semibold mb-2">No cryptocurrencies found</div>
    <div className="text-gray-600">Try adjusting your search query or clear the search to see all coins.</div>
  </div>
);

const CoinRow = ({ coin, onClick }) => (
  <tr
    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
    onClick={() => onClick(coin)}
  >
    <td className="py-4 px-3 font-semibold text-gray-600 w-16">
      {coin.marketCapRank || 'N/A'}
    </td>
    <td className="py-4 px-3">
      <div className="flex items-center space-x-3 min-w-48">
        <img
          src={coin.image}
          alt={coin.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNFNUU3RUIiLz4KPHRleHQgeD0iMTYiIHk9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTc5Nzk3IiBmb250LXNpemU9IjEyIj4/PC90ZXh0Pgo8L3N2Zz4K';
          }}
        />
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{coin.name}</h3>
          <span className="text-gray-500 text-xs uppercase">{coin.symbol}</span>
        </div>
      </div>
    </td>
    <td className="py-4 px-3 text-right font-semibold text-gray-900 min-w-24">
      {formatCurrency(coin.currentPrice)}
    </td>
    <td className={`py-4 px-3 text-right font-semibold min-w-24 ${
      coin.priceChangePercentage24h >= 0 ? 'text-green-600' : 'text-red-600'
    }`}>
      {formatPercentage(coin.priceChangePercentage24h)}
    </td>
    <td className="py-4 px-3 text-right text-gray-600 font-medium min-w-30">
      {formatMarketCap(coin.marketCap)}
    </td>
    <td className="py-4 px-3 text-right text-gray-600 font-medium min-w-30">
      {formatMarketCap(coin.totalVolume)}
    </td>
  </tr>
);

const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => (
  <div className="flex justify-center items-center space-x-4 mt-8 p-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage <= 1 || loading}
      className="bg-white border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed font-medium py-2 px-4 rounded-md transition-colors duration-200 min-w-20"
    >
      Previous
    </button>
    <span className="text-gray-600 text-sm mx-4">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages || loading}
      className="bg-white border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed font-medium py-2 px-4 rounded-md transition-colors duration-200 min-w-20"
    >
      Next
    </button>
  </div>
);

const CoinTable = ({ onCoinClick }) => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('market_cap_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const coinsPerPage = 50;

  const fetchCoins = async (page = 1, order = 'market_cap_desc') => {
    try {
      setLoading(true);
      setError(null);

      const coinsData = await coinGeckoService.getCoinsMarkets({
        order,
        per_page: coinsPerPage,
        page,
      });

      setCoins(coinsData);
      setCurrentPage(page);
      setTotalPages(200); // Estimate based on CoinGecko data

    } catch (err) {
      console.error('Error fetching coins:', err);
      setError({
        title: 'Failed to Load Coins',
        message: err.message || 'Unable to fetch cryptocurrency data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () => debounce(async (query) => {
      if (query.trim() === '') {
        setFilteredCoins(coins);
      } else {
        const searchResults = await coinGeckoService.searchCoins(query, coins);
        setFilteredCoins(searchResults);
      }
    }, 300),
    [coins]
  );

  useEffect(() => {
    fetchCoins(1, sortOrder);
  }, [sortOrder]); 

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCoins(coins);
    }
  }, [coins, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    const newOrder = e.target.value;
    setSortOrder(newOrder);
    fetchCoins(1, newOrder);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && !loading) {
      fetchCoins(page, sortOrder);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetry = () => {
    fetchCoins(currentPage, sortOrder);
  };

  const handleCoinClick = (coin) => {
    if (onCoinClick) {
      onCoinClick(coin);
    }
  };

  if (loading) {
    return (
      <div className="w-full my-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full my-8">
        <ErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="w-full my-8">
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 min-w-80 md:min-w-0 px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-colors duration-200"
        />
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="min-w-52 px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-600 transition-colors duration-200"
        >
          <option value="market_cap_desc">Market Cap (High to Low)</option>
          <option value="market_cap_asc">Market Cap (Low to High)</option>
          <option value="price_desc">Price (High to Low)</option>
          <option value="price_asc">Price (Low to High)</option>
          <option value="percent_change_24h_desc">24h Change % (High to Low)</option>
          <option value="percent_change_24h_asc">24h Change % (Low to High)</option>
          <option value="volume_desc">Volume (High to Low)</option>
          <option value="volume_asc">Volume (Low to High)</option>
        </select>
      </div>

      {/* Empty State */}
      {filteredCoins.length === 0 && searchQuery.trim() !== '' ? (
        <EmptyState />
      ) : (
        <>
          {/* Coins Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="py-4 px-3 text-left font-semibold text-gray-700">Rank</th>
                  <th className="py-4 px-3 text-left font-semibold text-gray-700">Name</th>
                  <th className="py-4 px-3 text-left font-semibold text-gray-700">Price</th>
                  <th className="py-4 px-3 text-left font-semibold text-gray-700">24h Change</th>
                  <th className="py-4 px-3 text-left font-semibold text-gray-700">Market Cap</th>
                  <th className="py-4 px-3 text-left font-semibold text-gray-700">Volume (24h)</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.map((coin) => (
                  <CoinRow
                    key={coin.id}
                    coin={coin}
                    onClick={handleCoinClick}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination - Only show if not searching */}
          {searchQuery.trim() === '' && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CoinTable;